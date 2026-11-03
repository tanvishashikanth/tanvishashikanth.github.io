# T04 — Devlog index and Log entry pages

Status: ready-for-agent
Blocked by: 01

## Goal

Rebuild the Devlog as a ruled engineering log and make Log entries comfortable to read.

## Scope

- Devlog index: reverse-chronological entries with mono date, `LOG 00N` marker, display title, serif summary, mono tags.
- Log numbers derived from reverse-chronological position, newest highest.
- Log entry page: title, rail metadata (date, log number, tags, back link), prose styles for Markdown (headings, lists, links, code, blockquote).
- Page titles and labels use "Devlog" and "Log entry", never "Blog" or "Post".
- Empty state for a Devlog with no entries.

## Acceptance

- Index exposes one entry per Markdown file in the Devlog collection.
- Entry page renders the Markdown body and a working back link.
- One `<h1>` per page; headings inside prose are `<h2>` or lower.
- Rail is present on both routes.

## Depends on

T01.
