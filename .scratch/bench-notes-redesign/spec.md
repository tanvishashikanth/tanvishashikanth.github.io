# Spec: Bench Notes site redesign

Status: resolved

## Problem Statement

Tanvi's site currently looks like an extended Astro starter: a purple-and-gold aubergine theme with Lora serif, repeated rounded cards, and a layout that reads as templated rather than personal. The vocabulary is inconsistent — the navigation says "Blog" while every route, collection, and page title says "devlog" — and the Projects page is built from visibly fake example entries. For a recruiter or peer arriving cold, the site does not quickly establish who Tanvi is, what she is currently building, or why her work is worth a longer look.

The site owner needs a professional, inviting personal site with a distinctive point of view, one that presents her real work honestly and is straightforward to extend as projects and Log entries accumulate.

## Solution

Rebuild every surface around a single design direction — **Bench Notes**, an editorial engineering journal — with a lilac-and-cream palette, Instrument Serif display type, Source Serif 4 body type, and IBM Plex Mono utility type. Replace the generic card stack with a margin annotation rail, full-width Project rows, and ruled Devlog entries. Use one canonical vocabulary throughout, keep placeholder content clearly provisional, and ship a responsive, keyboard-accessible, reduced-motion-safe site with no new runtime dependencies.

## User Stories

1. As a first-time visitor, I want the homepage to explain who Tanvi is and what she studies within a few seconds, so that I know whether her work is relevant to me.
2. As a first-time visitor, I want a clear thesis statement at the top of the homepage, so that I understand her focus without reading a long bio.
3. As a first-time visitor, I want to see what Tanvi is currently working on, studying, and reading, so that the site feels alive rather than archival.
4. As a recruiter, I want a prominent link to Tanvi's resume, so that I can evaluate her quickly.
5. As a recruiter, I want the visual design to feel deliberate and professional, so that I trust the quality of the work presented.
6. As a visitor, I want to browse selected Projects from the homepage, so that I can assess her practical experience without hunting through navigation.
7. As a visitor, I want a dedicated Projects page that lists every Project, so that I can see the full body of work.
8. As a visitor, I want each Project row to show its name, purpose, technology stack, and links, so that I can understand and verify it.
9. As a visitor, I want a Project's status to be visible, so that I know whether it is shipped, in progress, or planned.
10. As a visitor, I want placeholder Projects to be clearly provisional, so that I am not misled into thinking they are real work.
11. As a visitor, I want to browse the Devlog index, so that I can follow Tanvi's learning over time.
12. As a visitor, I want each Devlog entry to show its date, number, title, summary, and tags, so that I can decide what to read.
13. As a visitor, I want to read a full Log entry on its own page with comfortable typography, so that longer writing is pleasant to read.
14. As a visitor, I want to move between the Devlog index and a Log entry easily, so that I do not lose my place.
15. As a visitor, I want navigation to use the same words as the pages it leads to, so that the site feels coherent.
16. As a visitor on a phone, I want the layout to reflow cleanly without horizontal scrolling, so that I can read and navigate comfortably.
17. As a keyboard user, I want a visible focus state on every interactive element, so that I can navigate without a mouse.
18. As a keyboard user, I want a skip link to the main content, so that I can bypass repeated navigation.
19. As a screen-reader user, I want semantic landmarks, one main heading per page, and descriptive link text, so that the site is understandable when announced.
20. As a visitor who prefers reduced motion, I want all animation suppressed, so that the site does not cause discomfort.
21. As a visitor with low vision, I want body and link colours to meet contrast requirements, so that I can read the content.
22. As a visitor, I want the site to load quickly without heavy client-side JavaScript, so that pages feel immediate.
23. As a visitor, I want a consistent visual identity across home, Projects, Devlog index, and Log entry pages, so that the site feels like one place.
24. As a visitor, I want a small, recognisable monogram as the favicon, so that the site is identifiable in a browser tab.
25. As a visitor, I want to contact Tanvi or find her GitHub and LinkedIn from the footer, so that I can follow up.
26. As the site owner, I want to add a Project by editing one data list, so that I do not have to touch layout code.
27. As the site owner, I want to add a Log entry by adding a Markdown file, so that publishing stays simple.
28. As the site owner, I want the design tokens defined in one place, so that I can adjust the palette or type later without hunting through pages.
29. As the site owner, I want the redesign to preserve my real facts and voice, so that the site still sounds like me.
30. As the site owner, I want placeholder content to be obvious, so that I remember what still needs replacing before sharing the site.
31. As the site owner, I want the site to build and pass its tests with one command, so that I can verify a change before deploying.
32. As a developer, I want the automated checks to assert rendered output rather than internal implementation, so that refactoring the design does not create false failures.

## Implementation Decisions

- **Design direction.** Commit to the Bench Notes direction: an editorial engineering journal with a warm cream ground, plum-black ink, lilac accent, hairline rules, and generous whitespace. No shadows, gradients, dark mode toggle, or decorative illustration.
- **Palette tokens.** Paper `#F6F1E8`, surface `#FCF9F3`, ink `#26202E`, muted `#6F6678`, lilac `#6E519B`, lilac-soft `#E9E1F4`, rule `#D9CFC1`. All colour decisions derive from these tokens.
- **Typography.** Three roles: Instrument Serif for display only (hero, page titles, Project names), Source Serif 4 for body copy, IBM Plex Mono for eyebrows, dates, log numbers, tags, navigation, and bench-card leaders. Fonts load from Google Fonts with preconnect and `display=swap`.
- **Layout system.** A centred content frame with a left margin annotation rail on wide viewports; the rail collapses to inline labels on narrow viewports. Home, Projects, Devlog index, and Log entry pages share the same rail and rule language.
- **Signature element.** The margin annotation rail: section numbers, mono labels, and hairline ticks, with the active label updating on scroll via `IntersectionObserver`. Without JavaScript, all labels render statically and remain readable.
- **Shared chrome.** Wordmark "Tanvi Shashikanth" with a `TS` monogram, nav reading `Projects`, `Devlog`, and `Resume`, and a footer repeating email, GitHub, LinkedIn, and the current year. Resume is the only button-styled nav item.
- **Home page.** Mono eyebrow (`ELECTRONICS & COMPUTER ENGINEERING · BITS GOA`), display thesis, short serif bio, a bench card listing current coursework/build/reading with dotted leaders, two calls to action, a selected-Projects section, and a latest-Devlog section.
- **Projects presentation.** Full-width case-study rows rather than equal cards. Each row shows an index number, name, description, stack as mono tokens, links, and an honest status label. Placeholder entries remain explicitly provisional, and placeholder URLs must not render as real destinations.
- **Devlog presentation.** The index renders ruled entries with a mono date and `LOG 00N` marker, display title, serif summary, and mono tags. Log numbers are derived from reverse-chronological order. A Log entry page places date and tags in the rail, renders prose at a readable measure with copper/lilac-ruled subheadings, and links back to the index.
- **Vocabulary.** Standardise on **Devlog** (never "Blog"), **Log entry** (never "Post" or "Article"), and **Project** (never "Work"). Page titles, navigation, headings, and empty states use these terms.
- **Metadata.** Each page gets a page-specific title and description; the shared layout provides language, viewport, charset, and basic social metadata. The favicon becomes the `TS` monogram.
- **Motion.** One orchestrated page-load sequence: the top rule draws and rail labels stagger in. Hover and focus transitions are limited to colour and underline. All motion is disabled under `prefers-reduced-motion`.
- **Accessibility.** Skip link to main content, one `<h1>` per page, semantic landmarks, visible `:focus-visible` outlines, descriptive link text, and contrast-checked tokens. Body and link colours must meet WCAG AA for normal text.
- **Responsiveness.** Fluid type and spacing; the rail collapses below the wide breakpoint; Project rows stack; navigation remains flat with three links and no hamburger.
- **Dependencies.** No new runtime dependencies. The only addition is a dev-only HTML parser for the test seam.
- **Placeholder honesty.** Do not invent employers, achievements, projects, or dates. Preserve Tanvi's existing facts and rewrite surrounding copy only for clarity and tone.
- **Conceptual modules.** Shared layout and design tokens, home page, Projects page and Project row component, Devlog index, Log entry page, Project data module, Devlog content collection, and the built-site test suite.

## Testing Decisions

- **One seam: the rendered build output.** Tests run after `astro build` and read the emitted HTML and CSS. No browser, visual-regression, or component-internal tests. This keeps the seam at the highest point and avoids coupling to Astro component structure.
- **What makes a good test here.** It asserts externally observable behaviour a visitor or crawler would see: routes exist, navigation exposes canonical labels, Project rows correspond to the data list, Log entries correspond to the content collection, each page has one `<h1>` and a language attribute, the skip link is present, and the expected design tokens appear in emitted CSS. Tests must not assert class names, component names, or DOM nesting.
- **Modules covered.** Home route, Projects route, Devlog index route, Log entry routes, shared navigation/footer, and emitted stylesheet tokens.
- **Prior art.** None; this is the first automated test suite in the repo. The suite establishes the pattern for future output-level checks.
- **Test command.** A single test script builds the site first, then runs the assertions, so a stale `dist/` cannot produce a false pass.

## Out of Scope

- Supplying real Project content, a resume PDF, a personal photograph, or real social URLs.
- Deployment configuration, hosting, analytics, comments, search, RSS, or a CMS.
- Dark mode or a theme toggle.
- Internationalisation.
- Browser-based visual regression, screenshot diffing, or cross-browser testing.
- Backend forms, authentication, or any server runtime.
- Changing the URL structure or routes.

## Further Notes

- The agreed vocabulary lives in `GLOSSARY.md`; future work should use those terms.
- The design direction was chosen over two alternatives (an instrument-panel look and a schematic-drawing look). The main trade-off is expressiveness versus recruiter-friendly legibility; Bench Notes was chosen for legibility and longevity.
- The site should remain easy for a student to maintain between terms: plain CSS, one data list, Markdown entries, and no framework.
