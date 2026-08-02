---
name: design-system-razorpay
description: >
  Apply the Razorpay design system when building or updating UI.
  Use when creating components, choosing colors or typography,
  or reviewing designs for documentation interfaces.
---

# Razorpay — Design System Skill

## When to Use

- Building new UI components for Razorpay.
- Reviewing or updating existing component styles.
- Choosing colors, typography, or spacing for documentation pages.
- Checking designs against the extracted token set.

## Context

- **Product:** Razorpay — https://razorpay.com/ai-builders/
- **Surface:** documentation
- **Audience:** Developers and technical teams
- **Character:** Developer-oriented knowledge base with a rich, diverse color palette and 6 typefaces.

## Tokens

### Colors

| Token | Value | Role |
|-------|-------|------|
| --brand-blue | `#1B4DFF` | Accent |
| --text | `#EEF0F6` | Text Light |
| color-1 | `#132644` | Text Primary |
| color-4 | `#828282` | Text Secondary |
| color-5 | `#9F9F9F` | Text Secondary |
| color-2 | `#0D11FF` | Background Dark |
| color-7 | `#F4F4F4` | Text Light |
| color-8 | `#FFFFFF` | Text Light |

### Typography

**Font stack:** Times, Instrument Serif, Lato, Inter Tight, monospace, TASA Orbiter Display

| Level | Size | Usage |
|-------|------|-------|
| text-xs | 7px | Captions, metadata |
| text-sm | 14px | Labels, secondary text |
| text-base | 16px | Body text (default) |
| text-lg | 18px | Subheadings, emphasis |
| text-xl | 23px | Section headings |
| text-2xl | 24px | Section headings |
| text-3xl | 39px | Section headings |
| text-4xl | 42px | Section headings |
| text-9 | 72px | General use |
| text-10 | 89px | General use |

**Weight scale:** 300 · 400 · 700
**Line heights:** 69.12px · 30px · 87.4483px · 20px · 18px · 24px · 22.521px · 6.606px · 37.05px · 58.8px

### Spacing

**Base unit:** 4px

`space-1: 7px` · `space-2: 10px` · `space-3: 14px` · `space-4: 16px` · `space-5: 20px` · `space-6: 32px` · `space-7: 36px` · `space-8: 48px`

### Shapes

**Border radius:** _None detected._

### Elevation

_None detected._

### Motion

- **duration-fast:** `all`
- **duration-fast:** `none`
- **duration-fast:** `color 0.08s`
- **duration-fast:** `opacity 0.15s`
- **duration-fast:** `background 0.15s, transform 0.15s`
- **duration-fast:** `background 0.15s, border-color 0.15s`
- **duration-base:** `opacity 0.2s ease-in`
- **duration-slow:** `transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)`
- **duration-slow:** `opacity 0.6s`
- **duration-slow:** `0.7s steps(1) infinite jFfkds-450290765`
- **duration-slow:** `opacity 0.8s`
- **duration-slow:** `opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1)`
- **duration-slow:** `opacity 1.2s`

## Component Inventory

- **Buttons:** 14 detected
- **Links:** 16 detected
- **Navigation:** 1 elements
- **Lists:** 2 detected
- **Code blocks:** 4 detected
- **Images:** 89 detected

## Constraints

### Always

- Use tokens from the tables above — do not introduce new values.
- Include hover, focus-visible, and disabled states for interactive elements.
- Follow the 4px spacing grid.
- Meet WCAG 2.2 AA contrast minimums.

### Never

- Do not introduce colors outside the extracted palette.
- Do not use arbitrary spacing values — stick to the scale.
- Do not center-align body text or code blocks.
- Do not use more than two font weights on a single page.
- Do not ship components without defining hover, focus-visible, and disabled states.

## Tone

Clear, precise, developer-oriented. Prefer short sentences and imperative verbs.

## Authoring Workflow

When creating or documenting a component for this system:

1. State intent — one sentence on purpose.
2. Map tokens — list every token the component uses.
3. Define anatomy — named parts with token assignments.
4. Specify states — default, hover, focus-visible, active, disabled, loading, error, empty.
5. Describe interactions — keyboard, pointer, touch, edge cases.
6. Add a11y criteria — testable pass/fail checks.
7. List anti-patterns — concrete misuse examples.
8. Close with the Definition of Done checklist.

## Output Structure

Component guidelines must contain, in order:

1. Overview (purpose, when to use, when not to use)
2. Tokens and foundations
3. Anatomy, variants, responsive behavior
4. States and interactions
5. Accessibility (ARIA, contrast, focus, screen reader)
6. Content guidelines (copy rules, tone)
7. Anti-patterns with reasoning

## Component Requirements

- Reference only tokens from the tables above.
- Define all states: default, hover, focus-visible, active, disabled, loading, error.
- Handle edge cases: empty, overflow, truncation, max content.
- Include keyboard navigation behavior.
- Document ARIA roles and labels.

## Definition of Done

- Default state renders (smoke test).
- All states visually verified.
- Zero hardcoded visual values — tokens only.
- Keyboard navigation works without pointer.
- No critical a11y violations.
- Tested at min and max breakpoint.
- At least one anti-pattern documented.
- Purpose, usage, and limitations documented.
