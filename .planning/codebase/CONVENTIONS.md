# Conventions

## Code Style
- **No semicolons** — relies on ASI
- **Double quotes** for JSX string attributes, otherwise standard TS inference
- **2-space indentation**
- **Trailing commas** in multiline constructs
- **No trailing whitespace**

## TypeScript Configuration
- **Strict mode** enabled (`strict: true`)
- `noUnusedLocals: true` — build fails on unused imports
- `noUnusedParameters: true` — build fails on unused function params
- `noFallthroughCasesInSwitch: true`
- `verbatimModuleSyntax: true` — requires `import type` for type-only imports
- Target: ES2023, JSX: react-jsx
- Path alias: `@/*` → `./src/*`

## Import Patterns
- Path alias `@/` used universally (no relative imports except within same directory)
- Type imports use `import type { X } from "..."` syntax (required by verbatimModuleSyntax)
- Order: React/library imports → UI component imports → local imports → type imports
- No barrel exports — direct file imports

## Component Patterns
- **Functional components only** (except ErrorBoundary which is a class component)
- Named exports: `export function ComponentName() { ... }`
- Props via inline interfaces: `interface ComponentNameProps { ... }`
- Hooks at the top of component body
- Conditional rendering inline (ternary or `&&`)

## State Management
- Zustand stores with selector pattern: `useStore((s) => s.field)`
- Stores accessed outside React via `useStore.getState()`
- Settings store uses `persist` middleware with `partialize`
- No React Context usage except ThemeProvider

## Naming Conventions
- **Components**: PascalCase (`ThreatCard`, `HealthScoreGauge`)
- **Files**: Match component name (`ThreatCard.tsx`)
- **Stores**: `use` + PascalCase + `Store` (`useAnalysisStore`)
- **Service functions**: camelCase (`runThreatAnalysis`, `generateBlogPost`)
- **Types/Interfaces**: PascalCase (`SystemArchitecture`, `Threat`)
- **Constants**: SCREAMING_SNAKE_CASE (`SEVERITY_COLORS`, `THREAT_TEMPLATES`)
- **Type unions**: PascalCase or kebab-case strings (`"owasp-llm" | "stride"`)

## CSS / Styling
- **TailwindCSS v4** with `@tailwindcss/vite` plugin
- `@theme inline` block in `index.css` with oklch CSS custom properties
- `@custom-variant dark (&:is(.dark *))` for dark mode
- shadcn/ui components use CVA (class-variance-authority) for variant styling
- `cn()` utility (clsx + tailwind-merge) for conditional class merging
- Inline Tailwind classes, no separate CSS modules

## shadcn/ui Usage
- 19 Radix-based components in `src/components/ui/`
- Components not modified from shadcn defaults
- `components.json` config with `@/` aliases
- TooltipProvider wraps entire app in App.tsx

## Export Patterns
- Named exports for all components
- Default export only for `App` component
- Types exported from dedicated `src/types/` files
- Constants exported from `src/lib/constants.ts` and `src/lib/plainEnglish.ts`
