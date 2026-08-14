# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A single Spanish-fluent reader (the app's owner and only user; no login, no multi-tenant use planned). They read physical books and encounter words worth keeping while reading — not because they don't understand the language, but because the word is literary, unusual, precise, or otherwise worth holding onto. This is vocabulary as appreciation, not language acquisition.

## Product Purpose

Capture a word encountered while reading — its grammatical category, definition, the page/chapter, the original sentence it appeared in, and an optional photo — linked to the book being read at that moment. Success is a durable, personally-owned archive of words worth keeping, built through a fast capture habit during real reading sessions.

## Positioning

Kindle's vocabulary builder, Readwise, and Anki all assume reading happens on a device. This app exists because the user reads physical books and needs a fast way to log a word by hand mid-session, into data they fully own (their own Supabase project, their own schema) rather than a vendor's proprietary store. The mechanism a neighboring product can't copy: it's shaped around the physical-book reading ritual (página/capítulo, oración original, foto of the page) rather than e-reader highlight export.

## Operating Context

- Used mid-reading-session, likely one-handed or with a book open on a surface nearby — capture needs to be fast enough not to break reading flow.
- A "libro activo" (active book) is chosen once per session and persists (localStorage) so repeat captures don't re-ask.
- Words are optionally linked to a "libro" (book/collection); a word can also be captured with no book association.
- No login; RLS is intentionally open on the anon key. The project must stay private (not publicly shared) rather than access-controlled in-app.
- Deployed to GitHub Pages via GitHub Actions on push to main.

## Capabilities and Constraints

- Single-user, no authentication — confirmed durable, not a v1-only limitation.
- UI language is Spanish-only — confirmed durable, no bilingual/i18n requirement.
- No search/filter over captured words yet (v2, per README) — the archive is expected to stay small enough for now that grouped browsing (by grammatical category) is sufficient.
- No sentence game, etymology/synonyms, or stats yet (v2, per README).
- Fields per word: palabra, categoría gramatical (sustantivo/verbo/adjetivo/adverbio), definición, página/capítulo, oración original, imagen (optional). Only palabra and definición are actually required.
- Stack: React + Vite + TypeScript + Tailwind CSS v4, Supabase (Postgres + Storage), GitHub Pages deploy. (Existing codebase; not a greenfield stack decision.)

## Brand Commitments

- Product name: "Diccionario Personal." No other naming, logo, or identity assets are established as binding.
- The current paper/ink/amber "reading notebook" visual metaphor is incumbent implementation, not a confirmed binding brand commitment — open to replacement in a redesign.

## Evidence on Hand

- `schema.sql` defines the real data model (libros, palabras) — authoritative for what fields exist.
- `README.md` documents the intended capture flow and explicit v1/v2 scope split.
- No real captured content, testimonials, screenshots, or press exist to reference. Do not fabricate example words, books, or usage stats beyond the placeholder-quality examples already in the UI (e.g. "efímero").

## Product Principles

1. Capture speed during a live reading session outranks completeness or organization — friction here is the thing most likely to kill the habit.
2. The archive is a personal keepsake, not a study tool — design for the feeling of building something over time, not for spaced-repetition/retention mechanics.
3. Data ownership is the product's actual differentiator versus Kindle/Readwise/Anki — the physical-book capture ritual (página/capítulo, oración original, foto) is the mechanism that expresses it.
4. Single-user and Spanish-only are durable constraints, not gaps to fill — do not add auth, multi-language UI, or multi-tenant affordances.
5. v1 deliberately excludes search, stats, sentence games, and etymology — the redesign should not smuggle these in as a side effect of visual work.

## Accessibility & Inclusion

No project-specific accessibility requirement was established beyond standard web accessibility practice (the prior critique found and the harden/polish pass fixed a contrast failure and unlabeled mobile nav; maintain WCAG AA going forward).
