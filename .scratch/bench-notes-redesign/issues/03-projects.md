# T03 — Projects page and Project row

Status: resolved
Blocked by: 01

## Goal

Replace the card grid with full-width case-study rows and honest placeholder handling.

## Scope

- Project row component: index number, display title, description, stack as mono tokens, status label, conditional links.
- Projects page: display heading, short intro, rows for every item in the data module.
- Data module: remove invented project claims; mark entries as `placeholder`; omit placeholder URLs.
- Status rendering for `placeholder`, `in progress`, and `shipped` (or equivalent).
- When no real links exist, show a quiet "Links coming soon" line instead of dead anchors.

## Acceptance

- Row count equals the number of entries in the data module.
- No `your-username` or other placeholder URL appears as an `href`.
- Each row has one heading and a visible status.
- Page uses one `<h1>` and the shared rail.

## Depends on

T01.
