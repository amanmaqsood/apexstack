# Razorpay

## Overview

**Product:** Razorpay
**URL:** https://razorpay.com/ai-builders/
**Surface type:** documentation
**Audience:** Developers and technical teams
**Brand character:** Developer-oriented knowledge base with a rich, diverse color palette and 6 typefaces.

### Design Principles

- Clarity over density — every element should reduce time-to-answer.
- Scannable structure — use hierarchy so users find before they read.
- Code-first — code examples are primary content, prose is secondary.

## Colors

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

## Typography

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

## Spacing

**Base unit:** 4px

`space-1: 7px` · `space-2: 10px` · `space-3: 14px` · `space-4: 16px` · `space-5: 20px` · `space-6: 32px` · `space-7: 36px` · `space-8: 48px`

## Shapes

**Border radius:** _None detected._

## Elevation

_None detected._

## Motion

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

## Components

- **Buttons:** 14 detected
- **Links:** 16 detected
- **Navigation:** 1 elements
- **Lists:** 2 detected
- **Code blocks:** 4 detected
- **Images:** 89 detected

## Do's and Don'ts

### Do

- Reference tokens by name, not raw values — agents and developers should use `color.text.primary`, not `#171717`.
- Define all interactive states: default, hover, focus-visible, active, disabled.
- Use the spacing scale for all padding, margin, and gap values.
- Write content in sentence case. Reserve ALL CAPS for acronyms only.
- Test every component at the smallest and largest breakpoint before shipping.

### Don't

- Do not introduce colors outside the extracted palette.
- Do not use arbitrary spacing values — stick to the scale.
- Do not center-align body text or code blocks.
- Do not use more than two font weights on a single page.
- Do not ship components without defining hover, focus-visible, and disabled states.

## Writing Tone

Clear, precise, developer-oriented. Prefer short sentences and imperative verbs.

## Authoring Workflow

When creating or updating a component guideline for this system, follow this sequence:

1. **State the intent** — one sentence on what the component does and why it exists.
2. **Map tokens** — list every color, spacing, typography, and radius token the component uses. No raw values.
3. **Define anatomy** — break the component into named parts (container, label, icon, etc.) with their token assignments.
4. **Specify states** — document every state: default, hover, focus-visible, active, disabled, loading, error, empty.
5. **Describe interactions** — keyboard, pointer, and touch behavior, including edge cases (long content, overflow, truncation).
6. **Add accessibility criteria** — write testable pass/fail checks (e.g. "focus ring must be visible at 3:1 contrast").
7. **List anti-patterns** — concrete examples of misuse with a brief explanation of why each is wrong.
8. **Close with a QA checklist** — a mechanical list of verifiable items (see Definition of Done below).

## Required Output Structure

Every component guideline produced from this system must contain these sections, in order:

1. Overview — purpose, when to use, when not to use.
2. Tokens and foundations — all referenced tokens from the tables above.
3. Anatomy and variants — named parts, variant matrix, responsive behavior.
4. States and interactions — full state table, keyboard/pointer/touch behavior.
5. Accessibility — ARIA attributes, contrast requirements, focus management, screen reader behavior.
6. Content guidelines — copy length, tone, capitalisation, placeholder text rules.
7. Anti-patterns — explicit examples of what not to build, with reasoning.

## Component Requirements

Every component built against this system must:

- Reference only tokens defined in the tables above — no hardcoded hex, px, or font values.
- Define all interactive states: default, hover, focus-visible, active, disabled, loading, error.
- Specify responsive behavior at the smallest and largest supported breakpoint.
- Handle edge cases: empty state, overflow / truncation, maximum content length.
- Include keyboard navigation (Tab, Enter, Escape, Arrow keys where applicable).
- Document ARIA roles, labels, and live-region behavior where relevant.
- Include known page component density: - **Buttons:** 14 detected
- **Links:** 16 detected
- **Navigation:** 1 elements
- **Lists:** 2 detected
- **Code blocks:** 4 detected
- **Images:** 89 detected

## Definition of Done

A component is not complete until every item below is checked:

- Renders correctly in its default state (smoke test).
- All states documented and visually verified (hover, focus, disabled, loading, error, empty).
- All visual values use design tokens — zero hardcoded values.
- Keyboard navigation works without a pointer.
- No critical accessibility violations (contrast, ARIA, focus order).
- Tested at smallest and largest breakpoint.
- Anti-patterns section lists at least one concrete misuse example.
- Documentation covers purpose, usage, props/API, and limitations.
