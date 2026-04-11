# Structure

## Directory Tree
```
src/
├── main.tsx                          # React root mount
├── App.tsx                           # Provider tree + routes
├── index.css                         # TailwindCSS v4 theme (oklch variables)
├── vite-env.d.ts                     # Vite type declarations
│
├── pages/                            # Route-level page components
│   ├── HomePage.tsx                  # Landing page (plain English aware)
│   ├── InputPage.tsx                 # System input + analyze button
│   ├── AnalysisPage.tsx              # Results: gauge, summary, threats, checklist
│   └── ExportPage.tsx                # 4-format export center
│
├── components/
│   ├── ui/                           # shadcn/ui primitives (19 components)
│   │   ├── alert.tsx, badge.tsx, button.tsx, card.tsx
│   │   ├── collapsible.tsx, dialog.tsx, dropdown-menu.tsx
│   │   ├── input.tsx, label.tsx, progress.tsx
│   │   ├── scroll-area.tsx, select.tsx, separator.tsx
│   │   ├── sheet.tsx, skeleton.tsx, switch.tsx
│   │   ├── tabs.tsx, textarea.tsx, tooltip.tsx
│   │   └── (all Radix-based, CVA-styled)
│   │
│   ├── layout/                       # App shell
│   │   ├── Header.tsx                # Nav, PlainEnglishToggle, LiveModeToggle, ApiKeyInput
│   │   ├── Footer.tsx                # Simple footer
│   │   └── PageContainer.tsx         # Max-width wrapper
│   │
│   ├── input/                        # Input page components
│   │   ├── SystemInputForm.tsx       # 3-tab container (wizard/freeform/structured)
│   │   ├── InterviewWizard.tsx       # Yes/No guided wizard (8 steps)
│   │   ├── FreeformInput.tsx         # Textarea for natural language
│   │   ├── StructuredInput.tsx       # Tabs for component/flow/boundary editors
│   │   ├── ComponentEditor.tsx       # Add/remove SystemComponents
│   │   ├── DataFlowEditor.tsx        # Source→target flow editor
│   │   └── TrustBoundaryEditor.tsx   # Trust boundary + component selection
│   │
│   ├── analysis/                     # Analysis page components
│   │   ├── AnalysisPanel.tsx         # Progress bar during analysis
│   │   ├── HealthScoreGauge.tsx      # Animated SVG dial (0-100, A-F grade)
│   │   ├── RiskSummary.tsx           # 3-card grid (score, severity, frameworks)
│   │   ├── ThreatCard.tsx            # Expandable threat with stories/impacts
│   │   ├── ThreatFilters.tsx         # Framework/severity/component filter badges
│   │   ├── QuickWinsChecklist.tsx    # Prioritized action plan with print
│   │   └── FrameworkBadge.tsx        # Colored framework label badge
│   │
│   ├── export/                       # Export page components
│   │   ├── ExportCenter.tsx          # 4-tab export interface
│   │   ├── MermaidExport.tsx         # Mermaid render + SVG download
│   │   ├── MarkdownExport.tsx        # Blog/GitHub markdown preview
│   │   └── LinkedInExport.tsx        # Slide grid + PDF download
│   │
│   ├── shared/                       # Reusable cross-page components
│   │   ├── ApiKeyInput.tsx           # Dialog for API key management
│   │   ├── LiveModeToggle.tsx        # Mock ↔ Live switch
│   │   ├── PlainEnglishToggle.tsx    # Technical ↔ Plain English toggle
│   │   └── ErrorBoundary.tsx         # React error boundary
│   │
│   ├── ThemeToggle.tsx               # Dark/light/system switcher
│   └── theme-provider.tsx            # Theme context provider
│
├── stores/                           # Zustand state stores
│   ├── useSystemStore.ts             # Architecture + input state
│   ├── useAnalysisStore.ts           # Results + filters + analysis status
│   ├── useSettingsStore.ts           # Settings (persisted)
│   └── useExportStore.ts             # Export generation state
│
├── services/
│   ├── analysis/
│   │   └── threatEngine.ts           # Core analysis engine (mock + live)
│   ├── claude/
│   │   ├── client.ts                 # Anthropic SDK client factory
│   │   ├── prompts.ts                # 5 prompt builders
│   │   ├── streamAnalysis.ts         # Streaming wrapper
│   │   └── parseResponse.ts          # JSON extraction + auto-repair
│   ├── export/
│   │   ├── mermaidGenerator.ts       # Mermaid flowchart syntax
│   │   ├── blogGenerator.ts          # Blog post markdown
│   │   ├── githubGenerator.ts        # GitHub report (GFM)
│   │   ├── linkedinGenerator.ts      # LinkedIn slide data
│   │   └── pdfGenerator.tsx          # @react-pdf Document
│   └── mock/
│       ├── delay.ts                  # simulateDelay utility
│       ├── mockSystem.ts             # Hardcoded 7-component RAG example
│       └── mockAnalysis.ts           # Hardcoded 14-threat result
│
├── lib/
│   ├── utils.ts                      # cn() (clsx + tailwind-merge)
│   ├── constants.ts                  # FRAMEWORK_LABELS, STATUS_MESSAGES
│   ├── plainEnglish.ts               # Translations, stories, impacts, quick wins
│   └── frameworks/
│       ├── owasp-llm-top10.ts        # 10 OWASP LLM categories
│       ├── stride.ts                 # 6 STRIDE categories
│       └── mitre-atlas.ts            # 16 ATLAS tactics, 35+ techniques
│
└── types/
    ├── system.ts                     # ComponentType, SystemArchitecture, etc.
    ├── threat.ts                     # Threat, RiskScore, Severity, etc.
    ├── framework.ts                  # Framework category interfaces
    └── export.ts                     # Export format types
```

## Stats
- **79 source files** (.ts/.tsx)
- **~8,120 lines** of TypeScript/TSX
- **19 shadcn/ui components**
- **4 Zustand stores**

## File Naming Conventions
- Components: PascalCase (`ThreatCard.tsx`, `HealthScoreGauge.tsx`)
- Stores: camelCase with `use` prefix (`useAnalysisStore.ts`)
- Services: camelCase (`threatEngine.ts`, `blogGenerator.ts`)
- Types: camelCase (`threat.ts`, `system.ts`)

## Module Organization
- **By feature type** (not by feature): components grouped by domain area (input, analysis, export), services by function (claude, export, mock)
- All imports use `@/` path alias resolving to `src/`
- Named exports for all components, default export only for App
