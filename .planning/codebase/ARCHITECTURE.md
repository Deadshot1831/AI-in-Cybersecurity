# Architecture

## Application Pattern
- **Single Page Application (SPA)** built with React 19 + Vite 8
- Client-side routing via `react-router-dom` v7
- No SSR/SSG — purely client-rendered
- Dark theme default with light/system toggle

## Entry Points
- `src/main.tsx` — React root mount with `StrictMode`
- `src/App.tsx` — Provider tree: `ThemeProvider > TooltipProvider > ErrorBoundary > BrowserRouter`
- `src/index.css` — TailwindCSS v4 theme with oklch color variables

## Routing (4 routes)
| Path | Page | Purpose |
|------|------|---------|
| `/` | HomePage | Landing page, feature cards |
| `/input` | InputPage | System architecture input (3 modes) |
| `/analysis` | AnalysisPage | Threat analysis results + health gauge |
| `/export` | ExportPage | 4-format export center |

## State Management — Zustand (4 stores)
All stores use `create()` from Zustand. Settings store uses `persist` middleware.

| Store | File | Responsibilities |
|-------|------|------------------|
| `useSystemStore` | `stores/useSystemStore.ts` | Architecture, components, data flows, trust boundaries, freeform text, input mode |
| `useAnalysisStore` | `stores/useAnalysisStore.ts` | Analysis results, status, progress, streaming text, filters, `analysisRequested` flag |
| `useSettingsStore` | `stores/useSettingsStore.ts` | API key, live mode, plain English toggle, theme (persisted to localStorage) |
| `useExportStore` | `stores/useExportStore.ts` | Generated exports per format, generation state, errors |

## Data Flow
```
User Input → SystemStore → threatEngine.ts → AnalysisStore → UI rendering
                                ↓
                    (mock mode) parseFreeformToArchitecture() / template matching
                    (live mode) Claude API → 5 streaming calls → JSON parsing
```

1. **Input Phase**: User provides system architecture via 3 input modes:
   - Guided Interview Wizard (yes/no questions → auto-builds architecture)
   - Freeform text (parsed by keyword rules into components)
   - Structured editor (manual component/flow/boundary CRUD)

2. **Analysis Phase**: `runThreatAnalysis()` in `threatEngine.ts`:
   - Mock mode: Template-based threat generation from 12 `THREAT_TEMPLATES`
   - Live mode: 5 sequential Claude API calls (system parse → OWASP → STRIDE → ATLAS → correlation)
   - Results stored in `useAnalysisStore`

3. **Export Phase**: 4 generators transform `ThreatAnalysisResult` → export artifacts:
   - Mermaid diagram (flowchart syntax)
   - Blog post (markdown)
   - GitHub report (GFM with tables)
   - LinkedIn carousel (PDF via `@react-pdf/renderer`)

## Dual-Mode Analysis Engine
- **Mock mode** (default): No API key needed. Uses `THREAT_TEMPLATES` with `appliesTo()` functions that check component types. Different architectures → different threat subsets.
- **Live mode**: Requires Anthropic API key. Streams Claude responses for each framework, then correlates into final JSON.

## Plain English Mode
- Toggle in header switches all UI terminology between technical and simplified
- Translations in `src/lib/plainEnglish.ts`
- Story scenarios, business impacts, quick wins classification all computed from threat data
- Persisted in settings store

## Error Handling
- `ErrorBoundary` class component wraps entire app
- `threatEngine.ts` catches errors and sets `status: "error"` with message
- Export generators have per-format error tracking in `useExportStore`

## Key Architectural Decisions
- **Browser-side API calls**: `dangerouslyAllowBrowser: true` for Anthropic SDK (no backend)
- **No backend/database**: Entirely client-side, state in memory + localStorage
- **shadcn/ui**: 19 Radix-based components in `src/components/ui/`
- **Framework data as code**: OWASP, STRIDE, ATLAS definitions hardcoded in `src/lib/frameworks/`
