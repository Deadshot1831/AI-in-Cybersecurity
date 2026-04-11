# Concerns

## Critical

### API Key Exposed in Browser
- **File**: `src/services/claude/client.ts:6`
- `dangerouslyAllowBrowser: true` sends the Anthropic API key directly from the browser
- Any user with DevTools can extract the key from network requests
- **Risk**: Key theft, unauthorized API usage, billing abuse
- **Mitigation**: Add a backend proxy or use Anthropic's CORS-safe endpoints

### Unsanitized HTML Rendering
- **Files**: `src/components/export/MermaidExport.tsx:112`, `src/components/export/MarkdownExport.tsx:85`
- `dangerouslySetInnerHTML` used for Mermaid SVG and marked() markdown output
- Mermaid-generated SVG and user-influenced markdown could contain XSS vectors
- **Risk**: Cross-site scripting if LLM output contains malicious HTML
- **Mitigation**: Sanitize with DOMPurify before rendering

## High

### No Automated Tests
- Zero test files, no test framework installed
- All quality assurance is manual
- Regressions can ship undetected
- **Impact**: High risk of breaking changes going unnoticed

### Bundle Size (2.2 MB uncompressed)
- Main chunk `index-*.js` is 2,187 KB (711 KB gzipped)
- Mermaid library alone accounts for ~1 MB+ of chunks
- `@react-pdf/renderer` and `cytoscape` add significant weight
- **Mitigation**: Lazy-load mermaid, PDF renderer, and export components via `React.lazy()`

### Dead Code — Mock Files
- `src/services/mock/mockSystem.ts` and `src/services/mock/mockAnalysis.ts` contain hardcoded data
- `mockSystem.ts` is still imported by 3 export components (`ExportCenter.tsx`, `MermaidExport.tsx`, `LinkedInExport.tsx`) as fallback
- `mockAnalysis.ts` appears unused after the threat engine rewrite
- **Impact**: Adds confusion about which data path is active

## Medium

### No Input Validation on Freeform Text
- `parseFreeformToArchitecture()` in `threatEngine.ts` processes raw user text with regex
- No length limits beyond the 20-char minimum check
- No rate limiting on analysis requests
- **Risk**: Denial-of-wallet via rapid mock analyses (low impact) or live Claude calls (high impact)

### Missing Error Recovery
- Analysis errors set `status: "error"` but there's no retry mechanism
- Once in error state, user must navigate away and back to retry
- No graceful degradation if Claude API is unreachable

### Accessibility Gaps
- No `aria-label` on icon-only buttons in several components
- SVG gauge in `HealthScoreGauge.tsx` has no `aria-` attributes for screen readers
- Color-only severity indicators (red/orange/yellow/green) lack text alternatives for color-blind users
- Interview wizard progress not announced to screen readers

### SOC-Style CSS Animations Referenced but Not Defined
- `AnalysisPage.tsx` references `animate-soc-count-up` class
- `HealthScoreGauge.tsx` references `animate-soc-glow-yellow/orange/red` and `soc-scan-line` keyframes
- These CSS animations may need to be defined in `index.css` for the effects to work

## Low

### No Offline Support
- App requires internet for live mode (Claude API)
- No service worker or PWA manifest
- No caching strategy for framework data

### localStorage Persistence Risks
- Settings store persists API key to localStorage
- Clearing browser data wipes all settings
- No import/export of settings

### Console Warnings Possible
- `useEffect` dependency arrays in `AnalysisPage.tsx` reference reactive values that could cause lint warnings
- React StrictMode double-rendering may trigger `requestAnimationFrame` animations twice in development

### No Favicon or Meta Tags
- Default Vite favicon
- No Open Graph tags for link previews
- No `<meta name="description">` for the app
