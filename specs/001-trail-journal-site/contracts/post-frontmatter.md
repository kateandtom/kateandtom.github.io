# Contract: Post front matter → rendered byline

**Feature**: `001-trail-journal-site` | **Serves**: FR-002a, FR-002b, FR-002c, FR-002d,
SC-008a, SC-008b

A static site has no API, so the contract that matters is the one between what an author
types on a phone and what a reader sees. These cases are the acceptance criteria for
`_includes/byline.html`. Each row must be verified against the rendered page, on both the
post page and the journal listing.

**Given** `_data/authors.yml`:

```yaml
kate: Kate
tom: Tom
sam: Sam
```

**and** `_config.yml` defaults for `_posts`: `authors: [kate, tom]`

| # | Front matter | Rendered byline | Why it matters |
|---|---|---|---|
| C1 | *(no `authors` field)* | `Kate and Tom` | The co-written default. Cheapest possible post — zero characters typed. |
| C2 | `authors: kate` | `Kate` | Solo post, bracket-free. The most common non-default case. |
| C3 | `authors: tom` | `Tom` | Same, other walker. |
| C4 | `authors: [kate, tom]` | `Kate and Tom` | Explicit form must equal the default form exactly. |
| C5 | `authors: [tom, kate]` | `Tom and Kate` | Order is as declared, never sorted (FR-002b). |
| C6 | `authors: [kate, sam]` | `Kate and Sam` | Guest contributor, no template change (FR-002d). |
| C7 | `authors: [kate, tom, sam]` | `Kate, Tom and Sam` | Three or more: commas, then "and" before the last. |
| C8 | `authors: [kate]` | `Kate` | One-element list renders identically to the bare string. |
| C9 | `authors: kat` *(typo)* | `kat` | Unknown key renders raw and visibly wrong, never blank. |
| C10 | `authors: ""` | `Kate and Tom` | Empty value falls back to the default, not to an empty byline (FR-002c). |

## Rendering rules

1. Normalise `authors` to a list: if it is a string, wrap it in a one-element list.
2. If the list is empty or the field is absent, use the `_config.yml` default.
3. Map each key through `_data/authors.yml`; if the key is missing, emit the key itself.
4. Join: one name bare; two as `A and B`; three or more as `A, B and C`.
5. Emit no punctuation of its own beyond the joining — the layout supplies "by", the date,
   and any surrounding markup.

## Non-goals

- No author pages, author archives, or filtering by author.
- No avatars, links, or per-author styling.
- No sorting or de-duplication of the declared list.

---

# Contract: Post front matter → publication state

**Serves**: FR-010, FR-007

| # | Front matter | Journal listing | Feed | Built to `_site` |
|---|---|---|---|---|
| P1 | *(no `published` field)* | listed | included | yes |
| P2 | `published: true` | listed | included | yes |
| P3 | `published: false` | absent | absent | no |

**Rule**: a draft must disappear from every generated surface at once — listing, feed, and
sitemap-equivalent — with no per-surface logic. This follows automatically from Jekyll
excluding unpublished posts from `site.posts`; the contract exists to make sure no template
ever iterates a collection that bypasses it.

---

# Contract: Post front matter → location line

**Serves**: FR-002e, FR-002f, FR-002g, SC-008c

| # | Front matter | Post page and listing |
|---|---|---|
| L1 | *(no `place` field)* | No location line at all — no empty element, no stray separator |
| L2 | `place: "Waiau Pass"` | `Waiau Pass` shown with the date and byline |
| L3 | `place: "Tāngata Whenua"` | Renders with macrons intact |
| L4 | `place: ""` | Treated as absent — behaves exactly as L1 |

**Rules**: the value is displayed verbatim. It is never parsed, geocoded, linked, or
validated against any list of places.

## With a hike label

`trip` is not written in the post — it comes from a path-scoped default keyed on the
post's folder. Place and trip render as one phrase, never as two labelled fields.

| # | `place` | `trip` | Rendered |
|---|---|---|---|
| L5 | `Titcomb Basin` | `Wind River Range` | `Titcomb Basin, Wind River Range` |
| L6 | `Titcomb Basin` | *(none)* | `Titcomb Basin` |
| L7 | *(none)* | `Wind River Range` | `Wind River Range` |
| L8 | *(none)* | *(none)* | nothing — no separator, no empty element |
| L9 | `""` | `""` | nothing — same as L8 |

A post in `_posts/wind-rivers/` must produce L5 or L7 without declaring `trip`; a post
directly in `_posts/` must produce L6 or L8.

---

# Contract: Filename → URL

**Serves**: FR-002, SC-009, and the same-day and macron edge cases

| # | Filename | Title | URL |
|---|---|---|---|
| U1 | `_posts/2026-11-03-whanganui.md` | `Down the Whanganui` | `/2026/11/03/whanganui/` |
| U2 | `_posts/2026-11-03-tangata-whenua.md` | `Tāngata Whenua` | `/2026/11/03/tangata-whenua/` |
| U3 | `_posts/2026-11-03-morning.md` + `_posts/2026-11-03-evening.md` | — | two distinct URLs, both listed |

**Rules**

- The URL derives from the filename only. Editing a post's `title` must never change its URL.
- Macrons and other non-ASCII characters live in `title`, never in the filename.
- Two posts on one date are distinguished by their slugs; identical slugs on the same date
  are an authoring error and will collide.
