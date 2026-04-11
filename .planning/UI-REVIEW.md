# UI Review - AI Threat Modeler

**Date**: 2026-04-11
**Scope**: Full application (4 pages, all components)
**Theme audited**: Dark (default) + Light mode notes

---

## Overall Score: 18 / 24

| Pillar | Score | Verdict |
|--------|-------|---------|
| Copywriting | 3 / 4 | PASS |
| Visuals | 3 / 4 | PASS |
| Color | 3 / 4 | PASS |
| Typography | 3 / 4 | PASS |
| Spacing | 3 / 4 | PASS |
| Experience Design | 3 / 4 | PASS |

**Overall Verdict**: PASS - Solid foundation with specific areas for polish.

---

## 1. Copywriting (3/4)

### Strengths
- **Dual-mode copy is the standout feature.** Plain English translations are genuinely helpful, not patronizing. "Urgent - Fix Immediately" vs "critical" is exactly the right register shift.
- **InterviewWizard questions are natural.** "Can anyone on the internet talk to your AI?" is far better than "Is your system public-facing?" for non-technical users.
- **Help text is contextual and specific.** "Called RAG - if your AI looks up company docs, knowledge bases, or PDFs before answering" bridges the jargon gap.
- **CTAs adapt to mode.** "Check My AI System" vs "Get Started" shows attention to audience.
- **Severity translations work well.** "Serious - Fix This Week" conveys both urgency and timeline.

### Issues

| Issue | Location | Impact |
|-------|----------|--------|
| InputPage card title/description never adapts to plain English | `InputPage.tsx:37-39` | Non-technical users hit "LLM/GenAI" jargon immediately |
| ExportPage has zero plain English adaptations | `ExportPage.tsx` | Entire page speaks only technical language |
| Footer always shows framework names | `Footer.tsx:12` | Minor - non-technical users don't know what "MITRE ATLAS" is |
| Header nav labels don't change | `Header.tsx:13-17` | "Input" and "Analysis" are slightly jargon-y for plain English mode |
| AnalysisPanel status messages are technical-only | `AnalysisPanel.tsx:24` | "Analyzing OWASP..." means nothing to non-technical users |
| "Live" badge on analysis header is unexplained | `AnalysisPage.tsx:96` | Users may wonder "live" as opposed to what? |
| "Analyze Threats" button label doesn't adapt | `InputPage.tsx:48-51` | Should say something like "Check for Problems" in plain English |

### Recommendation
Complete the plain English pass on InputPage, ExportPage, AnalysisPanel, Header nav labels, and the Analyze button. These are the remaining gaps in an otherwise thorough localization effort.

---

## 2. Visuals (3/4)

### Strengths
- **Lucide icons used consistently** across all components with appropriate sizes (h-3.5 to h-12).
- **SVG gauge is well-crafted.** Glow filters, animated needle, and color-coded segments create a professional dashboard feel.
- **SOC-style glass effects** add visual depth without overwhelming content.
- **Wizard icon-per-step** (Globe, Bot, BookOpen, Lock, Zap, Key, RefreshCw) provides instant visual recognition.
- **Severity stripe** on ThreatCard left edge is an effective visual cue borrowed from SOC dashboards.
- **Animated category bars** with scan-line effects at high scores sell the "live monitoring" aesthetic.

### Issues

| Issue | Location | Impact |
|-------|----------|--------|
| No favicon or app icon | `index.html` | Default Vite icon undermines brand |
| Emoji mixed with Lucide icons in wizard | `InterviewWizard.tsx:403-420` | Yes/No buttons use text emoji (cross mark, check mark) which render inconsistently across OS |
| Homepage lacks visual weight | `HomePage.tsx` | Shield-in-circle is the only visual; no hero illustration or background |
| No visual distinction between mock/live data | `AnalysisPage.tsx` | Users can't tell if results are real or demo data |
| Footer is visually sparse | `Footer.tsx` | Single line of text with small icon; no links, no visual interest |
| No Open Graph / social preview images | N/A | Shared links show no preview |

### Recommendation
Replace text emoji in wizard Yes/No buttons with Lucide icons (X, Check) for cross-platform consistency. Add a branded favicon. Consider a subtle background pattern or gradient on the homepage hero section.

---

## 3. Color (3/4)

### Strengths
- **oklch color system** is modern and perceptually uniform - good technical foundation.
- **Dark/light mode fully implemented** with proper CSS variable switching.
- **Semantic severity palette is consistent** throughout: red (critical), orange (high), yellow (medium), green (low) - used in dots, badges, bars, glows, and stripes.
- **SOC glow animations match severity** - `soc-glow-red` on critical cards reinforces urgency.
- **Category bars use distinct, meaningful colors** - blue (privacy), red (hacking), amber (reliability).
- **Framework color-coding** (blue OWASP, purple STRIDE, red ATLAS) aids rapid scanning.

### Issues

| Issue | Location | Impact |
|-------|----------|--------|
| Light mode glass effect is invisible | `index.css:194-198` | `rgba(255,255,255,0.05)` on white background = no visible effect |
| No brand/accent color | `:root` theme variables | Primary is achromatic (`oklch(0.205 0 0)`) - the app has no distinctive color identity |
| Color-only severity indicators | Multiple components | No text fallback for color-blind users (red/green dots without labels) |
| Wizard gradients may lack contrast in light mode | `InterviewWizard.tsx:355` | `from-violet-500/20` on light background could wash out |
| Dark mode `.glass` border is very subtle | `index.css:200-203` | `rgba(255,255,255,0.06)` may be invisible on some displays |

### Recommendation
Add a light-mode specific `.glass` rule with a darker border/background. Consider introducing a brand accent color (e.g., a cyber blue or security green) to the primary variable. Add `aria-label` or text alongside severity color dots for accessibility.

---

## 4. Typography (3/4)

### Strengths
- **System font stack** (`system-ui, -apple-system, sans-serif`) renders natively with good performance.
- **Font smoothing** enabled for both webkit and moz rendering engines.
- **Clear size hierarchy**: h1 (4xl-5xl), page titles (2xl), card titles (base-lg), body (sm), labels (xs).
- **`tabular-nums`** used on all numerical displays (scores, counts) for proper alignment.
- **`font-mono`** applied to framework IDs and score values - appropriate differentiation.
- **Weight progression** is deliberate: bold (titles) > semibold (subtitles) > medium (labels) > normal (body).
- **Line height** applied consistently: `leading-relaxed` for descriptions, `leading-snug` for titles.

### Issues

| Issue | Location | Impact |
|-------|----------|--------|
| No custom/branded font | `index.css:123` | System-ui only; no typographic identity |
| `text-[10px]` badges may be too small | `ThreatCard.tsx:200`, `QuickWinsChecklist.tsx:141` | Below minimum readable size on some displays |
| No letter-spacing on uppercase labels | `ThreatFilters.tsx:64` | `uppercase` text benefits from `tracking-wide` |
| Footer text very small | `Footer.tsx:12` | `text-xs` on secondary info is fine, but paired with `text-muted-foreground` it nearly disappears |
| Long threat descriptions don't truncate | `ThreatCard.tsx:146` | Can create very tall expanded cards |

### Recommendation
Add `tracking-wider` to uppercase label elements. Consider bumping `text-[10px]` badges to `text-[11px]` minimum. A custom font (e.g., Inter, JetBrains Mono for code) would strengthen brand identity.

---

## 5. Spacing (3/4)

### Strengths
- **Consistent Tailwind spacing scale**: `gap-2` (tight), `gap-3` (item), `gap-4` (section), `gap-6` (major).
- **PageContainer** provides reliable max-width (`max-w-7xl`) and responsive padding.
- **Card internals follow shadcn conventions** (CardHeader + CardContent with built-in spacing).
- **Grid layouts use appropriate gaps**: `gap-6` between major sections, `gap-3` between list items.
- **Responsive breakpoints** are well-chosen: `grid-cols-1 lg:grid-cols-[320px_1fr]` for gauge+summary.
- **Separators** used effectively to break dense content in filters and checklists.

### Issues

| Issue | Location | Impact |
|-------|----------|--------|
| ScrollArea height is fragile | `AnalysisPage.tsx:178` | `calc(100vh-500px)` assumes specific header/content heights; breaks on unusual viewports |
| Mixed spacing conventions in wizard | `InterviewWizard.tsx` | Main card uses `px-6 pt-6 pb-4`, detected-features strip uses `p-3` — inconsistent internal padding |
| ThreatCard hardcodes left padding | `ThreatCard.tsx:85,135` | `pl-5` for severity stripe offset; fragile if stripe width changes |
| Deep nesting in threat cards creates indentation | `ThreatCard.tsx:186-209` | Business impact cards inside expanded content inside card — 3 levels of padding |
| No consistent section spacing in AnalysisPage | `AnalysisPage.tsx` | `mb-6` (SOC header), `space-y-6` (content), but filter panel uses `gap-6` — three different spacing approaches |

### Recommendation
Replace `calc(100vh-500px)` with a flex-based layout or CSS `min()` function. Standardize section spacing to one approach (prefer `space-y-6` for vertical flow). Consider a CSS variable for the severity stripe width so padding stays in sync.

---

## 6. Experience Design (3/4)

### Strengths
- **4-page flow is intuitive**: Home > Input > Analysis > Export follows natural task progression.
- **Dual-mode UX (Plain English / Technical)** is a genuine innovation for threat modeling tools.
- **InterviewWizard** is excellent for non-technical users - progress bar, back navigation, detected-features strip, animated transitions, and completion celebration.
- **Staggered animations** on threat cards (`animationDelay: i * 80ms`) create a "scanning" effect that reinforces the SOC dashboard metaphor.
- **Gauge animation** builds suspense for score reveal - good emotional design.
- **Reveal interaction** on mitigations (click to show) reduces cognitive load.
- **Loading state** (AnalysisPanel) with spinner + progress bar + contextual messages.
- **Empty state** on AnalysisPage with icon, description, and CTA.
- **QuickWins checklist** with checkable items, progress tracking, and print export.
- **Filter badges** are toggleable with proper minimum-one-selected guard.

### Issues

| Issue | Location | Impact |
|-------|----------|--------|
| No toast/notification system | App-wide | No feedback for clipboard copy, PDF download, or export generation |
| No retry mechanism after analysis error | `AnalysisPanel.tsx` | Error state is a dead end - user must navigate away and back |
| No route transition animations | `App.tsx` | Page changes are abrupt; inconsistent with the otherwise animated UI |
| No breadcrumb or flow indicator | App-wide | User can't see where they are in the Home > Input > Analysis > Export journey |
| Mobile: key controls hidden behind hamburger | `Header.tsx:57-85` | PlainEnglish toggle, LiveMode, ApiKey all require opening the sheet |
| No keyboard shortcuts | App-wide | Power users can't navigate with keyboard |
| No undo after wizard completion | `InterviewWizard.tsx:278` | Must manually switch to Structured Input tab to re-edit; no "Start Over" button |
| Export page doesn't adapt to plain English | `ExportPage.tsx` | "Mermaid", "Blog Post", "GitHub" labels mean little to non-technical users |
| No skip/preview option in wizard | `InterviewWizard.tsx` | Can't skip ahead or see what questions remain |

### Recommendation
Add a toast system (shadcn `sonner` or similar) for action feedback. Add a "Try Again" button to the error state in AnalysisPanel. Consider a simple step indicator (1-2-3-4) in the header showing the user's position in the workflow. Add a "Start Over" button to the wizard completion screen.

---

## Cross-Cutting Findings

### Accessibility Gaps (Priority: High)
- No `aria-label` on icon-only buttons in several components (severity dots, filter badges)
- SVG gauge has no `aria-` attributes for screen readers
- Color-only indicators lack text alternatives
- Wizard progress not announced to screen readers
- Print popup may not work with screen readers

### Performance Observations
- Main chunk is 2.2 MB (711 KB gzipped) — Mermaid is the main contributor
- Gauge and category bars use `requestAnimationFrame` which is appropriate
- Staggered CSS animations are GPU-friendly (transform + opacity only)
- No lazy loading on export components (Mermaid, PDF renderer loaded eagerly)

### Light Mode Polish Needed
- `.glass` utility is effectively invisible in light mode
- Wizard gradient backgrounds may lack sufficient contrast
- SOC glow animations designed for dark mode may look odd on white
- Overall the app was clearly designed dark-first; light mode is functional but not polished

---

## Top 5 Improvements (Ranked by Impact)

1. **Complete the plain English pass** — InputPage, ExportPage, AnalysisPanel, and the "Analyze" button still speak technical language, breaking the experience for non-technical users.

2. **Add a toast/notification system** — Actions like "Copy syntax", "Download SVG", "Generate Blog" give no visible feedback. Install `sonner` (already shadcn-compatible) and add toast confirmations.

3. **Fix light mode glass effect** — `.glass` with `rgba(255,255,255,0.05)` is invisible on white. Add a light-mode rule: `background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.08)`.

4. **Add retry to error state** — AnalysisPanel error is currently a dead end. Add a "Try Again" button that calls `resetAnalysis()` + `requestAnalysis()`.

5. **Replace emoji with icons in wizard Yes/No** — The cross mark/check mark text emoji render inconsistently across platforms. Use Lucide `X` and `Check` icons for visual consistency.
