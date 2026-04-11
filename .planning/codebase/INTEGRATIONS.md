# External Integrations

**Analysis Date:** 2026-04-11

## APIs & External Services

**Anthropic Claude API:**
- Purpose: Live AI-powered threat analysis of system architectures against OWASP LLM Top 10, STRIDE, and MITRE ATLAS frameworks
- SDK: `@anthropic-ai/sdk` ^0.82.0
- Client creation: `src/services/claude/client.ts`
- Model used: `claude-sonnet-4-20250514` (hardcoded in `src/services/claude/streamAnalysis.ts`)
- Max tokens: 8192 per request
- Auth: User-provided API key stored in Zustand store with localStorage persistence
- Key configuration: `dangerouslyAllowBrowser: true` - API calls made directly from browser (no backend proxy)
- Streaming: Uses `client.messages.stream()` for real-time response streaming

**API Call Flow:**
1. User provides API key via `src/components/shared/ApiKeyInput.tsx`
2. Key stored in `useSettingsStore` (persisted to localStorage as `ai-threat-modeler-settings`)
3. `src/services/analysis/threatEngine.ts` orchestrates the analysis pipeline
4. Four sequential Claude API calls when in live mode:
   - OWASP LLM Top 10 analysis (`buildOwaspPrompt` in `src/services/claude/prompts.ts`)
   - STRIDE analysis (`buildStridePrompt`)
   - MITRE ATLAS analysis (`buildAtlasPrompt`)
   - Correlation/synthesis of all three (`buildCorrelationPrompt`)
5. Each call uses streaming via `src/services/claude/streamAnalysis.ts`
6. Responses parsed from JSON with fallback error correction in `src/services/claude/parseResponse.ts`

**Mock Mode:**
- When live mode is disabled (no API key or toggle off), the app uses local mock data
- Mock system: `src/services/mock/mockSystem.ts` - Enterprise RAG Chatbot example
- Mock analysis: `src/services/mock/mockAnalysis.ts` - 14 pre-built threats with full framework mappings
- Dynamic mock generation: `src/services/analysis/threatEngine.ts` generates context-aware threats based on user-described system architecture (no API call needed)
- Simulated delay: `src/services/mock/delay.ts` - 1500ms artificial delay for UX

## Data Storage

**Databases:**
- None - This is a purely client-side SPA with no backend database

**Browser localStorage:**
- Key `ai-threat-modeler-settings`: Persists API key, theme preference, live mode toggle, plain English mode toggle
  - Managed by: `src/stores/useSettingsStore.ts` via Zustand `persist` middleware
- Key `ai-threat-modeler-theme`: Persists dark/light/system theme selection
  - Managed by: `src/components/theme-provider.tsx`

**In-Memory State (Zustand stores):**
- `useSystemStore` (`src/stores/useSystemStore.ts`): Current system architecture, input mode, parsing state
- `useAnalysisStore` (`src/stores/useAnalysisStore.ts`): Analysis results, status, progress, streaming text, filters
- `useExportStore` (`src/stores/useExportStore.ts`): Generated export data (Mermaid, blog, GitHub, LinkedIn)
- `useSettingsStore` (`src/stores/useSettingsStore.ts`): API key, live mode, plain English, theme

**File Storage:**
- None - No server-side file storage
- Client-side blob generation for PDF export (`src/services/export/pdfGenerator.tsx`)
- File downloads triggered via dynamically created `<a>` elements

**Caching:**
- None - No explicit caching layer; Zustand stores hold current session state only

## Authentication & Identity

**Auth Provider:**
- None - No user authentication system
- Anthropic API key is the only credential, provided directly by the user
- Key stored in localStorage (plaintext) - intended for personal/development use only
- Warning displayed to users in `src/components/shared/ApiKeyInput.tsx`: "Your API key is stored in this browser's localStorage"

## Monitoring & Observability

**Error Tracking:**
- None - No external error tracking service (no Sentry, Datadog, etc.)
- Client-side `ErrorBoundary` component at `src/components/shared/ErrorBoundary.tsx`

**Logs:**
- Console-only - No structured logging framework
- Error states managed through Zustand store (`error` fields in analysis and export stores)

## CI/CD & Deployment

**Hosting:**
- Static SPA deployment - `dist/` output from `npm run build`
- `deploy.zip` present in project root (pre-built deployment archive)
- No platform-specific deployment configuration detected (no Vercel, Netlify, or AWS configs)

**CI Pipeline:**
- Not detected - No GitHub Actions, CircleCI, or other CI configuration files

## Environment Configuration

**Required env vars:**
- None - No `.env` files or `import.meta.env` references detected
- All configuration is runtime (user-provided API key through UI)

**Runtime Configuration:**
- Anthropic API key: Provided via UI dialog, stored in localStorage
- Theme: dark/light/system, stored in localStorage
- Live mode toggle: Switches between Claude API analysis and local mock/dynamic analysis
- Plain English mode: Toggles between technical and non-technical language

## Content Generation Libraries

**Mermaid (^11.14.0):**
- Purpose: Architecture and threat flow diagram rendering
- Usage: Dynamically imported in `src/components/export/MermaidExport.tsx`
- Generated by: `src/services/export/mermaidGenerator.ts`
- Output: Flowchart diagrams with trust boundaries, data flows, and threat annotations
- Renders to SVG in browser

**Marked (^17.0.5):**
- Purpose: Markdown-to-HTML rendering for export previews
- Usage: `src/components/export/MarkdownExport.tsx`
- Renders blog post and GitHub report previews with `dangerouslySetInnerHTML`

**@react-pdf/renderer (^4.3.2):**
- Purpose: Client-side PDF generation for LinkedIn carousel slides
- Usage: `src/services/export/pdfGenerator.tsx`
- Output: 1080x1080px slide pages with dark theme styling
- Generates PDF blob for download

## Export Integrations

The app generates content for external platforms but does not directly integrate with their APIs:

**Mermaid Diagram Export:**
- Generator: `src/services/export/mermaidGenerator.ts`
- Component: `src/components/export/MermaidExport.tsx`
- Features: Copy syntax to clipboard, download SVG, live preview rendering

**Blog Post Export:**
- Generator: `src/services/export/blogGenerator.ts`
- Component: `src/components/export/MarkdownExport.tsx`
- Output: Full markdown blog post with executive summary, threat details, risk table, mitigations

**GitHub Report Export:**
- Generator: `src/services/export/githubGenerator.ts`
- Output: Markdown formatted for GitHub issues/security advisories with severity emojis, component tables, mitigation checklists

**LinkedIn Carousel Export:**
- Generator: `src/services/export/linkedinGenerator.ts`
- PDF renderer: `src/services/export/pdfGenerator.tsx`
- Component: `src/components/export/LinkedInExport.tsx`
- Output: Multi-slide PDF carousel (1080x1080px) with threat model highlights

## Security Frameworks (Local Data)

The following cybersecurity framework data is bundled as static TypeScript constants (no external API calls):

- **OWASP LLM Top 10 2025:** `src/lib/frameworks/owasp-llm-top10.ts` - All 10 categories with descriptions, example attacks, mitigation strategies
- **STRIDE:** `src/lib/frameworks/stride.ts` - 6 categories with AI-specific examples
- **MITRE ATLAS:** `src/lib/frameworks/mitre-atlas.ts` - Tactics and techniques for adversarial ML threats

## Webhooks & Callbacks

**Incoming:**
- None - No server-side endpoints

**Outgoing:**
- Anthropic Messages API (streaming) - Only external network call
- No other webhooks or callbacks

## MCP Tools

The project has a code-review-graph MCP tool configuration described in `CLAUDE.md` for development-time code navigation, but this is a developer tooling concern only - not part of the application runtime.

---

*Integration audit: 2026-04-11*
