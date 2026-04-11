# Technology Stack

**Analysis Date:** 2026-04-11

## Languages

**Primary:**
- TypeScript ~5.9.3 - All application code (`src/**/*.ts`, `src/**/*.tsx`)
- TSX (JSX in TypeScript) - All React components

**Secondary:**
- CSS - Styling via TailwindCSS v4 (`src/index.css`)
- HTML - Single entry point (`index.html`)

**TypeScript Configuration:**
- Target: ES2023
- Module: ESNext with bundler resolution
- Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`
- JSX: react-jsx (automatic runtime)
- Path alias: `@/*` maps to `./src/*`
- Config files: `tsconfig.json` (references), `tsconfig.app.json` (app code), `tsconfig.node.json` (Vite config)

## Runtime

**Environment:**
- Node.js v24.11.1 (development/build only - this is a client-side SPA)
- Browser runtime (production) - targets ES2023-compatible browsers

**Package Manager:**
- npm 11.6.2
- Lockfile: `package-lock.json` present (240KB)

## Frameworks

**Core:**
- React ^19.2.4 - UI framework (`src/main.tsx` entry point)
- React DOM ^19.2.4 - DOM rendering
- React Router DOM ^7.14.0 - Client-side routing (`src/App.tsx`)

**State Management:**
- Zustand ^5.0.12 - Global state management with `persist` middleware
  - `src/stores/useSystemStore.ts` - System architecture state
  - `src/stores/useAnalysisStore.ts` - Threat analysis results and filters
  - `src/stores/useSettingsStore.ts` - User settings (API key, theme, mode) with localStorage persistence
  - `src/stores/useExportStore.ts` - Export generation state

**UI Component Library:**
- shadcn/ui (default style, neutral base color) - configured in `components.json`
  - Built on Radix UI primitives
  - Icons: Lucide React ^1.7.0
  - Styling utilities: class-variance-authority ^0.7.1, clsx ^2.1.1, tailwind-merge ^3.5.0

**CSS/Styling:**
- TailwindCSS ^4.2.2 - Utility-first CSS framework
- @tailwindcss/vite ^4.2.2 - Vite plugin for TailwindCSS v4
- CSS Variables for theming (oklch color space) defined in `src/index.css`
- Dark/light mode via `.dark` class on `<html>`

**Build/Dev:**
- Vite ^8.0.1 - Build tool and dev server (`vite.config.ts`)
- @vitejs/plugin-react ^6.0.1 - React Fast Refresh and JSX transform

**Linting:**
- ESLint ^9.39.4 - Flat config format (`eslint.config.js`)
- typescript-eslint ^8.57.0 - TypeScript-aware linting
- eslint-plugin-react-hooks ^7.0.1 - React hooks rules
- eslint-plugin-react-refresh ^0.5.2 - Fast Refresh compatibility checks

**Testing:**
- Not detected - No test framework, test config, or test files found

## Key Dependencies

**Critical (core functionality):**
- `@anthropic-ai/sdk` ^0.82.0 - Claude API client for live threat analysis. Used with `dangerouslyAllowBrowser: true` for client-side API calls. Configured in `src/services/claude/client.ts`.
- `zustand` ^5.0.12 - All global state management. Uses `persist` middleware for localStorage persistence in `src/stores/useSettingsStore.ts`.
- `react-router-dom` ^7.14.0 - SPA routing with 4 routes: `/`, `/input`, `/analysis`, `/export`

**Content Generation:**
- `marked` ^17.0.5 - Markdown-to-HTML rendering for export previews (`src/components/export/MarkdownExport.tsx`)
- `mermaid` ^11.14.0 - Diagram rendering for architecture/threat flow diagrams, dynamically imported (`src/components/export/MermaidExport.tsx`)
- `@react-pdf/renderer` ^4.3.2 - Client-side PDF generation for LinkedIn carousel export (`src/services/export/pdfGenerator.tsx`)

**Radix UI Primitives (shadcn/ui foundation):**
- `@radix-ui/react-collapsible` ^1.1.12
- `@radix-ui/react-dialog` ^1.1.15
- `@radix-ui/react-dropdown-menu` ^2.1.16
- `@radix-ui/react-label` ^2.1.8
- `@radix-ui/react-progress` ^1.1.8
- `@radix-ui/react-scroll-area` ^1.2.10
- `@radix-ui/react-select` ^2.2.6
- `@radix-ui/react-separator` ^1.1.8
- `@radix-ui/react-slot` ^1.2.4
- `@radix-ui/react-switch` ^1.2.6
- `@radix-ui/react-tabs` ^1.1.13
- `@radix-ui/react-tooltip` ^1.2.8

## Configuration

**Build Configuration:**
- `vite.config.ts` - Vite config with React plugin, TailwindCSS plugin, and `@` path alias
- `tsconfig.json` - Project references to app and node configs
- `tsconfig.app.json` - App TypeScript config (ES2023, strict, react-jsx)
- `tsconfig.node.json` - Node/Vite TypeScript config
- `eslint.config.js` - ESLint flat config for TS/TSX files
- `components.json` - shadcn/ui configuration (default style, neutral color, lucide icons)

**Environment:**
- No `.env` file detected
- API key provided at runtime by user through the UI (`src/components/shared/ApiKeyInput.tsx`)
- Settings persisted to `localStorage` under key `ai-threat-modeler-settings`
- Theme persisted to `localStorage` under key `ai-threat-modeler-theme`

**Scripts (from `package.json`):**
```bash
npm run dev       # Start Vite dev server
npm run build     # TypeScript compile + Vite production build
npm run lint      # ESLint check
npm run preview   # Preview production build
```

## Platform Requirements

**Development:**
- Node.js (v24+ detected, likely works with v18+)
- npm
- No native dependencies or system-level requirements

**Production:**
- Static SPA - serves from any static file host
- `dist/` directory generated by `npm run build`
- Browser must support ES2023 (modern browsers)
- Requires user-provided Anthropic API key for live analysis mode
- No server-side component - all API calls made directly from browser

**Key Browser APIs Used:**
- `crypto.randomUUID()` - ID generation throughout the app
- `localStorage` - Settings and theme persistence
- `navigator.clipboard` - Copy-to-clipboard in export components
- `window.matchMedia` - System theme detection
- `window.open` - Print functionality for Quick Wins checklist
- `document.createElement("a")` - File download triggers for exports

---

*Stack analysis: 2026-04-11*
