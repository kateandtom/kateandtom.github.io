# Phase 1 Data Model: Walking Journal Site

**Date**: 2026-08-14 | **Feature**: `001-trail-journal-site`

There is no database. "Data" here means files in the repository and the front matter fields
the templates read. Every field below is one the site actually renders — Principle IV
forbids carrying any others.

---

## Entity: Author

**Stored in**: `_data/authors.yml`

A flat map of key → display name.

```yaml
kate: Kate
tom: Tom
```

| Field | Type | Required | Notes |
|---|---|---|---|
| *key* | string | yes | Lowercase, no spaces. Used in post front matter. |
| *value* | string | yes | Display name as it appears in the byline. |

**Rules**

- Adding a guest contributor is one new line here and nothing else (FR-002d).
- A key referenced by a post but absent from this file MUST render as the raw key, visibly
  wrong, rather than as blank space — so a typo is caught by reading the page.
- Keys are never shown to readers; display names are never used in front matter.

---

## Entity: Post

**Stored in**: `_posts/<hike>/YYYY-MM-DD-slug.md` — one file per post, ASCII filename (R5).
The folder sets the hike; a post directly in `_posts/` simply has no hike label.

```yaml
---
title: "Down the Whanganui"
authors: kate
---

Body text in Markdown.
```

| Field | Type | Required | Default | Serves |
|---|---|---|---|---|
| `title` | string | yes | — | FR-001, FR-002, FR-020 |
| `authors` | string *or* list of author keys | no | `[kate, tom]` from `_config.yml` defaults | FR-002a–c |
| `published` | boolean | no | `true` | FR-010 (set `false` for a draft) |
| `place` | string | no | *(none — line omitted)* | FR-002e |
| `trip` | string | no | set by the post's folder via `_config.yml` defaults | FR-002f |
| `description` | string | no | first ~30 words of body | FR-020 (link previews) |
| *date* | date | yes | — | taken from the **filename**, not a field |

**Rules**

- `authors` accepts a bare string (`authors: kate`) or a flow list
  (`authors: [kate, sam]`). The byline include normalises the string form into a
  one-element list before rendering (R4).
- Omitting `authors` entirely yields the joint byline. This is the intended shape of a
  co-written post — declaring nothing is the cheapest thing to type (SC-008b).
- `title` carries full orthography including macrons; the filename slug stays ASCII (R5).
- No `layout` field: `_config.yml` defaults set `layout: post` for everything in `_posts/`,
  so a post never has to declare it.
- `place` is free text shown to readers as written — `"Waiau Pass"`, `"Somewhere south of
  Boyle Village"`, `"a hut with no name"`. It is never parsed, geocoded, or linked, and
  carries no coordinates.
- When `place` is absent the location line is omitted entirely: no empty element, no
  dangling separator.
- `trip` is **never written in a post**. It comes from a path-scoped default in
  `_config.yml` keyed on the post's folder, so an entry inherits its hike for free (FR-002f).
  Writing it by hand is possible but is not the intended path.
- `place` and `trip` render as one phrase — `Titcomb Basin, Wind River Range` — not as two
  separately-labelled fields (FR-002g).
- No `categories`, `tags`, `author` (singular), `lat`, or `lng` fields. Out of scope; they
  must not appear.

**Derived, never stored**

- URL — from filename date + slug via the permalink pattern.
- Position in the listing — from date, descending.
- Feed membership — every post with `published: true`.

---

## Entity: Page

**Stored in**: `about.md`, `map.md` at the repository root; `index.html` for the journal
listing.

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Shown as the page heading and in `<title>`. |
| `layout` | string | yes | `page` for about/map, `home` for the listing. |
| `permalink` | string | yes | Explicit, e.g. `/about/`, `/map/`. Keeps URLs stable. |
| `description` | string | no | FR-020. |

---

## Entity: Site

**Stored in**: `_config.yml`

| Field | Value | Serves |
|---|---|---|
| `title` | Site title | FR-020 |
| `description` | One-line description | FR-020 |
| `url` | `https://kateandtom.github.io` | FR-021, feed absolute links |
| `baseurl` | `""` (empty — this is an organization site at the domain root) | FR-021 |
| `author` | Joint display name | feed metadata |
| `hikes` | List of `{name, where, embed_url, link_url}`, newest first | FR-013, FR-013a, FR-015 |
| `nav` | List of `{title, url}` | FR-003, R10 |
| `plugins` | `[jekyll-feed, jekyll-seo-tag]` | FR-017, FR-020 |
| `defaults` | `_posts` → `layout: post`, `authors: [kate, tom]`; plus one path-scoped block per hike setting `trip` | FR-002c, FR-002f, R4 |

**Rules**

- `baseurl` MUST stay empty. An organization site is served at the domain root; a non-empty
  baseurl silently breaks every relative link.
- Each hike carries **two different strings** from Google My Maps — the *embed* URL and the
  *shareable link*. Storing both here means a map can be swapped without touching a page.
- A hike with an empty `embed_url` is simply absent from the map page; it is not an error.
- Adding a hike means one entry in `hikes`, one `defaults` block, and one folder under
  `_posts/`. No template changes (FR-014b, SC-008e).

---

## Repository layout

```text
kateandtom.github.io/
├── _config.yml
├── _data/
│   └── authors.yml
├── _includes/
│   ├── byline.html          # normalises authors → "Kate and Tom"
│   ├── meta.html            # date · byline · place, trip
│   ├── head.html
│   └── nav.html
├── _layouts/
│   ├── default.html         # <html>, head, nav, content slot, footer
│   ├── home.html            # journal listing
│   ├── page.html            # about, map
│   └── post.html            # single post + byline
├── _posts/
│   ├── wind-rivers/
│   │   └── YYYY-MM-DD-slug.md
│   └── te-araroa/
│       └── YYYY-MM-DD-slug.md
├── assets/
│   ├── fonts/               # self-hosted Roboto woff2 (R6)
│   └── style.css            # the single stylesheet (Principle II)
├── img/                     # post images (R8)
├── about.md
├── map.md
├── index.html               # journal listing
├── .gitignore               # _site/, .jekyll-cache/, Gemfile.lock
└── README.md
```

**Not present, deliberately**: no `.github/workflows/` (R1), no `Gemfile` required for
publishing (optional, for local preview only), no `_drafts/` (R7), no `_sass/` (R2).
