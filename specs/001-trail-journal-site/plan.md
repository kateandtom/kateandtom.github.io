# Implementation Plan: Walking Journal Site

**Branch**: `001-trail-journal-site` | **Date**: 2026-08-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-trail-journal-site/spec.md`

## Summary

A hand-written Jekyll site published by GitHub Pages' "Deploy from a branch" source at
https://kateandtom.github.io, containing a chronological journal covering more than one long
walk, an about page, and a map page embedding one Google My Maps iframe per hike. No theme gem, no JavaScript, no build step run by either
walker, and no workflow file in the repository — a commit from the GitHub mobile web editor
is the entire publish action.

The design's centre of gravity is the constraint that both walkers publish from a phone with
patchy signal, for months at a time, across more than one trip. That is what rules out a custom Actions workflow, a local
build, an image pipeline, and a theme, and it is what shapes the multi-author front matter
so that the two common cases — a joint post and a solo post — cost zero and one bracket-free
line respectively.

## Technical Context

**Language/Version**: Jekyll 3.10.0 (fixed by GitHub Pages' build environment), Liquid,
Markdown (kramdown), plain CSS. No JavaScript.

**Primary Dependencies**: `jekyll-feed` 0.17.0, `jekyll-seo-tag` 2.8.0 — both from GitHub
Pages' supported plugin list, so no Gemfile is needed to publish.

**Storage**: Files in the git repository. No database. Posts are Markdown in `_posts/`,
author names in `_data/authors.yml`, configuration in `_config.yml`.

**Testing**: No test framework — see research R11. Verification is a written checklist run
against the rendered site plus GitHub's build status.

**Target Platform**: Current mobile and desktop Safari, Chrome, Firefox. Mobile is the design
target; desktop is supported, not optimised for.

**Project Type**: Static site, single project, repository root.

**Performance Goals**: Under 100 KB per page excluding images (SC-004); readable within 3
seconds on simulated 3G (SC-005); no horizontal scroll at 320 px (SC-006).

**Constraints**: Zero JavaScript; single stylesheet; every page readable with CSS and JS
disabled; publishing must touch exactly one file and require no local tooling; zero recurring
cost.

**Scale/Scope**: Two authors, occasional guests. Multiple hikes over years — Wind River
Range first, then Te Araroa. Dozens to low hundreds of posts. Four page types, four layouts,
four includes. Adding a hike is a configuration edit, not a code change.

## Constitution Check

*GATE: checked before Phase 0, re-checked after Phase 1 design. Constitution v1.1.0.*

| Principle | Gate | Verdict |
|---|---|---|
| **I. Static & Serverless** | No server, no database, no third-party runtime dependency beyond GitHub and the My Maps embed | **PASS** — and this gate did real work: it rejected the Google Fonts CDN in favour of self-hosted woff2 (R6), and rejected an image CDN (R8) |
| **II. Text-First Minimalism** | No CSS or JS framework, single stylesheet, <100 KB/page, JS only where nothing else works | **PASS** — zero JavaScript in the design; one `style.css`; the responsive map uses `aspect-ratio`, not a script |
| **III. Publish From Anywhere** | One file, commit, push, from a phone; listings generated not hand-maintained | **PASS** — "Deploy from a branch" needs no workflow (R1); listing, feed and archive all derive from `_posts/`; front matter defaults mean a joint post declares nothing (R4) |
| **IV. Own the Content** | Markdown and HTML in the repo; front matter limited to rendered fields; images owned | **PASS** — no theme gem hiding markup (R3); fonts committed (R6); front matter is five fields, all rendered (data-model) |
| **V. Boring Technology** | Dependencies justified against a plainer alternative; native capability preferred | **PASS** — two plugins, each mapped to one FR; `jekyll-sitemap` rejected for serving none; GitHub's native build preferred over a custom workflow |
| **Scope (multi-hike)** | No layout, template, page, or nav change may be needed to add a hike | **PASS** — a hike is a `hikes` entry, a `defaults` block, and a folder (R13) |

**Post-Phase-1 re-check**: no new violations. One judgement call is recorded below rather
than hidden: `_includes/byline.html` contains roughly three lines of Liquid to accept both a
string and a list for `authors`. Strictly, a list-only rule would be marginally simpler *code*.
It is accepted because Principle V's "plainer alternative" test protects the author, not the
template, and SC-008b makes the phone keyboard the thing being optimised. This does not rise
to a Complexity Tracking violation — it is a within-principle trade-off, argued in R4.

## Project Structure

### Documentation (this feature)

```text
specs/001-trail-journal-site/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 — 13 decisions with rejected alternatives
├── data-model.md        # Phase 1 — front matter schema, repo layout
├── quickstart.md        # Phase 1 — how to publish from a phone
├── contracts/
│   └── post-frontmatter.md   # Phase 1 — byline, draft, and URL contracts
└── tasks.md             # Phase 2 — created by /speckit-tasks, not by this command
```

### Source Code (repository root)

```text
kateandtom.github.io/
├── _config.yml              # site metadata, nav, plugins, front matter defaults
├── _data/
│   └── authors.yml          # kate: Kate / tom: Tom
├── _includes/
│   ├── head.html            # meta, seo tag, stylesheet, feed link
│   ├── nav.html             # gray nav bar, looped from _config.yml
│   ├── byline.html          # authors → "Kate and Tom"
│   └── meta.html            # date, byline, and "place, trip"
├── _layouts/
│   ├── default.html         # page shell
│   ├── home.html            # journal listing, newest first
│   ├── page.html            # about, map
│   └── post.html            # single post, byline, back link
├── _posts/
│   ├── wind-rivers/         # folder sets the hike label
│   └── te-araroa/
├── assets/
│   ├── fonts/               # self-hosted Roboto woff2, regular + bold
│   └── style.css            # the single stylesheet
├── img/                     # post images
├── index.html               # journal listing (layout: home)
├── about.md
├── map.md
├── .gitignore
└── README.md
```

**Structure Decision**: single project at the repository root, because GitHub Pages
organization sites publish from the root of `kateandtom.github.io` and `baseurl` must stay
empty. There is no `src/`–`tests/` split: the site has no application logic to separate, and
inventing directories to hold four layouts would add structure the constitution's Principle V
tells us to justify — it cannot be.

Deliberately absent: `.github/workflows/` (R1), `_drafts/` (R7), `_sass/` (R2). A `Gemfile`
is optional and exists only for local preview; publishing must never depend on it.

## Phase 2 preview

`/speckit-tasks` will decompose this into work. The intended slicing follows the spec's user
story priorities so each slice is independently shippable:

1. **Skeleton + P1 reading** — `_config.yml`, default/home/post layouts, stylesheet, fonts,
   one example post. Site is readable. (US1)
2. **P1 publishing** — front matter defaults, `_data/authors.yml`, byline include against
   the contract's ten cases, draft handling. Publishing from a phone is proven. (US2)
3. **P2 pages** — about page, map page looping over hikes with a fallback link each. (US3, US4)
4. **P3 feed** — `jekyll-feed` wiring and verification. (US5)
5. **Launch** — repo settings, Pages source, the quickstart checklist.

## Complexity Tracking

No constitution violations require justification. The one trade-off worth naming — Liquid
that accepts two shapes for `authors` — is argued in R4 and in the Constitution Check above,
and is a choice *between* readings of Principle V rather than an exception to it.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| *(none)* | — | — |
