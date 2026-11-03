# T01 — Design system and shared chrome

Status: resolved

## Goal

Establish the Bench Notes design system and the shared page frame that every route consumes.

## Scope

- Global stylesheet with the agreed lilac/cream tokens, type roles, spacing, measure, focus styles, selection, reduced-motion handling, and the one page-load sequence.
- Shared layout: head metadata, Google Fonts, skip link, wordmark, primary navigation (`Projects`, `Devlog`, `Resume`), footer (email/LinkedIn/current year), rail script with `IntersectionObserver` progressive enhancement.
- Site data module for name, email, LinkedIn, GitHub, and resume path.
- `TS` monogram favicon.
- Canonical vocabulary: never "Blog" in user-facing chrome.

## Acceptance

- `astro build` succeeds.
- Every route renders the same header/footer and a `<main id="main-content">`.
- Emitted CSS contains the seven palette tokens and `prefers-reduced-motion`.
- Navigation labels are exactly `Projects`, `Devlog`, `Resume`.
- Skip link targets the main landmark.
- No runtime dependency is added.

## Depends on

Nothing.
