# Claude Code Implementation Guide: AI Threat Modeler

This guide provides detailed instructions for Claude Code to implement the remaining backend/AI logic, wire up live analysis features, and handle edge cases thoroughly.

---

## 1. Prompt Engineering for Claude API Calls

The application uses **5 sequential prompts** to perform a complete threat analysis. All prompt templates are in `src/services/claude/prompts.ts`.

### Prompt 1: System Architecture Parser
**Purpose:** Convert freeform natural language into structured `SystemArchitecture` JSON.
**When used:** When user selects "Freeform Description" mode and clicks "Analyze"
**Model:** claude-sonnet-4-20250514
**Max tokens:** 4096

**Key considerations:**
- The prompt must instruct Claude to infer reasonable defaults (e.g., if user doesn't mention encryption, assume HTTPS for internal services)
- Component types should be mapped to the `ComponentType` enum values
- Trust boundaries should be inferred from network descriptions (e.g., "internet-facing" = low trust, "VPC" = high trust)
- If the description is too vague, the response should still produce a minimal valid architecture

**Edge cases:**
- User provides only 1-2 sentences: Parser should still produce at least 1 component
- User describes non-AI systems: Parser should note that no LLM components were identified
- User provides a numbered list vs prose: Both should parse correctly
- Non-English descriptions: Prompt should work with technical terms in any language

### Prompts 2-4: Framework Analysis (OWASP, STRIDE, ATLAS)
**Purpose:** Each runs independently against the system architecture, producing framework-specific threats.
**Model:** claude-sonnet-4-20250514
**Max tokens:** 8192

**Key considerations:**
- Each prompt includes the full framework category list to ensure coverage
- Threats should reference specific components by name (for later ID mapping)
- Severity scoring should be consistent across frameworks (use standard risk matrices)
- Mitigations should be actionable and specific to the system, not generic advice

**Edge cases:**
- Simple systems with only 1-2 components: Should still identify relevant threats (even basic systems have prompt injection risks)
- Systems without RAG/vector stores: OWASP LLM08 should be marked as not applicable
- Systems with agent/tool-use capabilities: Should trigger ATLAS Agentic Threats (AML.TA0014)
- Rate limiting on API: Each call may take 15-60 seconds; progress must update between calls

### Prompt 5: Correlation and Executive Summary
**Purpose:** Merge, deduplicate, and synthesize findings from all three framework analyses.
**Model:** claude-sonnet-4-20250514
**Max tokens:** 8192

**Key considerations:**
- Many threats will appear in multiple frameworks (e.g., prompt injection maps to OWASP LLM01, STRIDE Tampering, and ATLAS AML.T0051)
- The correlation prompt receives the raw JSON from prompts 2-4 as input
- Risk scores should be calculated based on severity counts and likelihood
- Executive summary should be 2-3 paragraphs suitable for non-technical stakeholders

**Edge cases:**
- If one framework call fails, correlation should work with partial data (2/3 frameworks)
- Very large system (10+ components): Input may approach token limits; truncate descriptions
- All threats are low severity: Overall risk score should still be meaningful (15-25 range)

---

## 2. JSON Schema Validation

The `parseResponse.ts` module handles Claude's sometimes inconsistent JSON output.

### Parsing Pipeline
```
Raw Claude text
    → Strip markdown fences (```json ... ```)
    → Find JSON boundaries ({ ... })
    → JSON.parse()
    → Type guards / validation
    → Return typed result
```

### Common Claude JSON Issues
1. **Markdown wrapping:** Claude often wraps JSON in ` ```json\n...\n``` ` despite being told not to
2. **Trailing commas:** `{"key": "value",}` — fix with regex before parsing
3. **Unescaped newlines in strings:** Particularly in description fields
4. **`null` vs missing fields:** Technique IDs in ATLAS mappings may be `null` or absent
5. **Number strings:** Relevance scores may come as `"85"` instead of `85`

### Validation Strategy
After parsing, validate:
- All threat severity values are in `["critical", "high", "medium", "low"]`
- All component names referenced in threats exist in the system architecture
- Risk scores are in 0-100 range
- At least 1 threat is identified (empty result should trigger a retry)

### Retry Logic
If parsing fails:
1. Log the raw response for debugging
2. Send a follow-up message: "Your previous response was not valid JSON. Please return ONLY the JSON object, no markdown formatting."
3. If second attempt fails, fall back to mock data with a warning

---

## 3. Streaming Implementation

The `streamAnalysis.ts` module uses the Anthropic SDK's `messages.stream()` API.

### Stream Event Flow
```
stream.on("text", callback)   → Partial text chunks → UI streaming display
stream.finalMessage()         → Complete message     → JSON parsing
```

### Progress Updates
During streaming, the UI should show:
- Current analysis phase (from `AnalysisStatus` enum)
- Progress percentage (increments between phases: 0→15→35→60→80→95→100)
- Streaming text in a monospace panel (optional, for live mode transparency)

### Error Handling During Streaming
- **401 Unauthorized:** Invalid API key → Show "Invalid API key" alert, clear key
- **429 Rate Limited:** → Extract `retry-after` header, show countdown, auto-retry
- **500 Server Error:** → Show "Claude API error", offer retry button
- **Network timeout:** → `stream.finalMessage()` will reject → catch and show error
- **Partial stream (disconnection):** → If `finalMessage()` never completes, timeout after 120s

### CORS and Browser Security
The `dangerouslyAllowBrowser: true` flag is required because:
- API calls go directly from the browser to `api.anthropic.com`
- No backend proxy is needed (simplifies deployment)
- The API key is exposed in browser DevTools (hence the security warning)

---

## 4. Mock Data Structure

The mock data in `src/services/mock/mockAnalysis.ts` mirrors the exact structure that live Claude analysis would produce. This is critical for:
- Development without API key costs
- Consistent UI testing
- Demo mode for presentations

### Mock Analysis Contains
- 14 realistic threats across all 3 frameworks
- Proper cross-framework mappings (threats reference multiple frameworks)
- Severity distribution: 2 critical, 5 high, 5 medium, 2 low
- Each threat has 1-3 mitigations with priority and effort ratings
- Component IDs match the mock system architecture

### Adding New Mock Threats
When extending mock data, ensure:
1. Threat IDs follow the pattern `t-NNN`
2. Component IDs reference existing mock components (`comp-ui`, `comp-gateway`, etc.)
3. OWASP mappings use IDs `LLM01` through `LLM10`
4. STRIDE categories use lowercase with hyphens (`information-disclosure`)
5. ATLAS tactic IDs follow the `AML.TA00XX` pattern

---

## 5. Export Generation Algorithms

### Mermaid Diagram Construction (`mermaidGenerator.ts`)
The algorithm:
1. Create `subgraph` blocks for each trust boundary
2. Add nodes for each component (parallelogram for external, rectangle for internal)
3. Add edges for each data flow with labels
4. Overlay top threats (critical/high only) as dashed lines with severity emoji
5. Apply CSS class styling (red for external, blue for internal)

**Limitations:**
- Mermaid has a node limit (~50); very large systems may need simplification
- Special characters in names must be sanitized (no `[]`, `"` in labels)
- Self-referential threat annotations (component threatens itself) use the same source/target

### LinkedIn Carousel PDF (`pdfGenerator.tsx`)
Uses `@react-pdf/renderer` to create a multi-page PDF:
- Each page is 1080x1080px (LinkedIn carousel standard)
- Dark theme (slate-900 background, white text)
- Blue accent bar at top of each slide
- Slide counter in top-right corner
- 10-12 slides total (configurable by slide generation logic)

**Performance note:** PDF generation happens on the main thread. For 12+ slides, consider wrapping in a Web Worker.

---

## 6. Security Considerations

### API Key Storage
- Stored in `localStorage` via Zustand's `persist` middleware
- Key name: `ai-threat-modeler-settings`
- Always show security warning dialog on first key entry
- Provide "Clear API Key" button in the settings dialog
- **Never** log the API key to console or include it in error reports

### XSS Prevention
- Mermaid rendering uses `dangerouslySetInnerHTML` with `securityLevel: "loose"` — this is safe because:
  - Mermaid content is generated server-side (our code), not from user input
  - The SVG is sanitized by Mermaid's internal parser
- Markdown preview uses `marked` library which sanitizes HTML by default
- LLM outputs (in threat descriptions) are rendered as text, not HTML

### Content Security
- The `marked` library should be configured with `sanitize: true` for markdown rendering
- Any user input that flows into Mermaid syntax is sanitized by `sanitizeId()` and `sanitizeLabel()`

---

## 7. Testing Strategy

### Component Testing
Test each major component independently:
- **SystemInputForm:** Add/remove components, data flows, trust boundaries
- **ThreatCard:** Expand/collapse, display all framework badges
- **ThreatFilters:** Toggle filters, verify threat count updates
- **ExportCenter:** Generate each export format, verify output structure

### Integration Testing
- Full flow: Input → Analyze (mock) → Dashboard → Export
- Verify mock analysis completes in ~7 seconds (sum of simulated delays)
- Verify all 14 mock threats appear in the dashboard
- Verify filters correctly hide/show threats

### Live API Testing (manual)
- Set API key → Toggle live mode → Run analysis on freeform input
- Verify streaming text appears in real-time
- Verify final results populate the dashboard
- Test with invalid API key → Verify error handling
- Test with very short description → Verify minimal viable analysis

### Export Testing
- **Mermaid:** Copy syntax → Paste in mermaid.live → Verify rendering
- **Blog:** Download .md → Open in markdown viewer → Check formatting
- **GitHub:** Download .md → Verify GFM tables render correctly
- **LinkedIn:** Download PDF → Verify 1080x1080 pages, text readability

---

## 8. Future Enhancements (Not Implemented)

These are documented for future development:

1. **Freeform Parsing in Live Mode:** Currently falls back to mock system. Wire up `SYSTEM_PARSER_PROMPT` to actually call Claude and parse the response into `SystemArchitecture`.

2. **Blog Post AI Enhancement:** In live mode, the blog generator could send raw analysis data to Claude with a "write this as an engaging blog post" prompt for higher-quality prose.

3. **Mermaid Lazy Loading:** The mermaid library is ~500KB. Use dynamic `import()` to lazy-load it only when the user visits the export page.

4. **Persistent Analysis History:** Store past analyses in localStorage or IndexedDB for comparison over time.

5. **PDF Carousel Web Worker:** Move `@react-pdf/renderer` generation to a Web Worker for non-blocking PDF generation.

6. **Custom Framework Extensions:** Allow users to define custom threat categories beyond OWASP/STRIDE/ATLAS.

7. **Team Sharing:** Export analysis results as shareable JSON for team collaboration.

---

## 9. File Reference

### Critical paths for implementation:
| File | Purpose |
|------|---------|
| `src/services/claude/prompts.ts` | All 5 prompt templates |
| `src/services/claude/parseResponse.ts` | JSON extraction + validation |
| `src/services/claude/streamAnalysis.ts` | Streaming API wrapper |
| `src/services/analysis/threatEngine.ts` | Main analysis orchestrator |
| `src/services/mock/mockAnalysis.ts` | Mock analysis data (14 threats) |
| `src/services/mock/mockSystem.ts` | Mock system architecture |
| `src/services/export/mermaidGenerator.ts` | Mermaid diagram generation |
| `src/services/export/blogGenerator.ts` | Blog post markdown generation |
| `src/services/export/githubGenerator.ts` | GitHub report generation |
| `src/services/export/linkedinGenerator.ts` | LinkedIn slide data generation |
| `src/services/export/pdfGenerator.tsx` | PDF rendering with @react-pdf |
| `src/stores/useAnalysisStore.ts` | Analysis state + filter logic |
| `src/stores/useSystemStore.ts` | System architecture state |
| `src/stores/useSettingsStore.ts` | API key + live mode settings |
| `src/types/threat.ts` | Core threat analysis types |
| `src/types/system.ts` | System architecture types |
