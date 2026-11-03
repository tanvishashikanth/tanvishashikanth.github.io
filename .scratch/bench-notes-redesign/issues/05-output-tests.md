# T05 — Built-site output tests

Status: ready-for-agent
Blocked by: 02, 03, 04

## Goal

Add the single agreed test seam: assertions against the built site.

## Scope

- One test command that builds first, then runs `node:test` against `dist/`.
- DOM parsing with a dev-only HTML parser.
- Assertions limited to external behaviour: route existence, canonical nav labels, Project row count, Log entry count, one `<h1>` and `lang` per page, skip link, design tokens in emitted CSS, reduced-motion rule, and no placeholder URLs as real links.
- No browser, screenshot, or component-internal assertions.

## Acceptance

- A clean checkout can run the test command and pass.
- Tests fail if the nav regresses to "Blog", a route disappears, a Project is dropped, or a palette token is removed.
- No production dependency is added.

## Depends on

T02, T03, T04.
