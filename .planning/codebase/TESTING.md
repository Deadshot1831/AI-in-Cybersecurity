# Testing

## Test Framework
- **No test framework installed.** No Jest, Vitest, or testing-library in dependencies.
- **No test files** exist in `src/` (zero `.test.ts`, `.spec.ts` files)
- **No test scripts** in `package.json` (only `dev`, `build`, `lint`, `preview`)

## Test Coverage
- **0% coverage** — no automated tests of any kind

## Linting
- **ESLint 9** with flat config (`eslint.config.js`)
- Plugins: `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `typescript-eslint`
- Extends: `js.configs.recommended`, `tseslint.configs.recommended`
- Targets: `**/*.{ts,tsx}` files
- Ignores: `dist/` directory
- Lint script: `npm run lint`

## Type Checking
- **TypeScript 5.9** with strict mode
- Build script runs `tsc -b` before `vite build`
- All strict checks enabled: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- Build will fail on any type error or unused import
- Path aliases configured in `tsconfig.app.json`

## CI/CD
- **No CI/CD pipeline** configured
- No GitHub Actions, no pre-commit hooks
- Build verification is manual: `npm run build`

## Quality Gates
| Gate | Status | Command |
|------|--------|---------|
| TypeScript type check | Active | `tsc -b` (part of build) |
| ESLint | Available | `npm run lint` |
| Unit tests | Missing | N/A |
| Integration tests | Missing | N/A |
| E2E tests | Missing | N/A |
| Visual regression | Missing | N/A |

## Recommendations
1. Add Vitest (Vite-native) for unit + component testing
2. Add `@testing-library/react` for component tests
3. Add Playwright for E2E testing of the 4-page flow
4. Add `npm test` script and pre-commit hook
