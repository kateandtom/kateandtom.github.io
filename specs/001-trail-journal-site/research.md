# Phase 0 Research: Walking Journal Site

**Date**: 2026-08-14 | **Feature**: `001-trail-journal-site`

All unknowns from the Technical Context are resolved below. Each entry records the decision,
why it was taken, and what was rejected.

---

## R1. Build and publishing mechanism

**Decision**: GitHub Pages with the publishing source set to **Deploy from a branch** →
`main` → `/` (root). No workflow file in the repository.

**Rationale**: GitHub moved Pages onto Actions internally, but "Deploy from a branch"
remains a first-class publishing source and is explicitly recommended for sites that "do not
need any control over the build process." GitHub generates and runs the build itself; the
repository contains no `.github/workflows/` file and neither walker ever maintains CI. This
is what makes Principle III (Publish From Anywhere) achievable — a commit from the GitHub
mobile web editor is the entire publish action.

**Alternatives rejected**:

- *Custom GitHub Actions workflow with Jekyll 4.x*: buys newer Jekyll and unrestricted
  plugins, at the cost of a workflow file that can break, needs its action versions bumped,
  and fails in ways that are invisible from a phone. Violates Principle V.
- *Building locally and committing `_site/`*: requires a laptop to publish. Fails Principle
  III outright.

**Consequence**: the site is pinned to GitHub's build environment — **Jekyll 3.10.0** — and
to its allowed plugin list. Every decision below respects that.

---

## R2. Jekyll version and plugins

**Decision**: Jekyll 3.10.0 as provided. Plugins limited to two:

| Plugin | Version | Serves |
|---|---|---|
| `jekyll-feed` | 0.17.0 | FR-017 (feed) |
| `jekyll-seo-tag` | 2.8.0 | FR-020 (titles, descriptions, link previews) |

**Rationale**: Both are on GitHub Pages' supported list, so they need no Gemfile management
and cannot break the build by drifting. Each maps to a specific functional requirement, as
Principle V requires.

`jekyll-sitemap` was considered and **rejected**: it serves no requirement in this spec, and
search engine indexing is not a goal for a personal trail journal.

**Jekyll 3.10 constraints to respect** (these are the traps):

- No `{% render %}` tag — Jekyll 3 has `{% include %}` only.
- `where_exp` and `group_by` exist; newer filters do not.
- Sass is old libsass. Avoided entirely by writing plain CSS (see R6).

---

## R3. Theme

**Decision**: No theme gem. Write three layouts and a small number of includes by hand.

**Rationale**: Gem-based themes hide their markup outside the repository, which conflicts
with Principle IV (Own the Content) and makes the "readable as a trail journal by a human
with a text editor" test fail. The site needs roughly 60 lines of layout HTML in total —
importing a theme to avoid writing 60 lines, and inheriting markup and CSS that must then be
overridden, is the more complex option, not the simpler one.

**Alternatives rejected**: `minima` (GitHub's default) — pulls in its own typography, colour
scheme, social-icon markup, and a footer that would all need overriding.

---

## R4. Multi-author bylines (FR-002a–d)

This is the fiddliest requirement, because SC-008b demands that co-authoring cost at most one
short, phone-typeable line, and YAML's list syntax fights that.

**Decision**: three layers.

1. `_data/authors.yml` maps a short key to a display name:

   ```yaml
   kate: Kate
   tom: Tom
   ```

   Adding a guest is one line here — satisfying FR-002d with no template change.

2. Post front matter accepts **either a bare string or a list**:

   ```yaml
   authors: kate            # solo — no brackets
   authors: [kate, sam]     # rare, e.g. a guest section
   ```

3. `_config.yml` front matter defaults set `authors: [kate, tom]` for everything in
   `_posts/`, so a **co-written post declares nothing at all** and a **solo post writes one
   bracket-free line**.

**Rationale**: this inverts the usual arrangement so that the two common cases are the
cheapest to type, which is the point of SC-008b. The cost is roughly three lines of Liquid in
`_includes/byline.html` to normalise a string into a one-element array before joining. That
is a deliberate, small complexity accepted in exchange for removing friction from an action
repeated a hundred times on a phone keyboard, and is justified under Principle V's
"plainer alternative" test — plainer *for the author*, which is who the principle protects.

**Joining rule**: one name renders bare; two render `A and B`; three or more render
`A, B and C`. Order is exactly as declared, never sorted (FR-002b).

**Unknown keys**: a key absent from `_data/authors.yml` must render visibly wrong (the raw
key) rather than silently blank, so a typo is caught by looking at the page — this is the
spec's misspelled-author edge case.

**Alternatives rejected**:

- *Always a YAML block list*: three lines and leading-space discipline per post. Hostile on a
  phone.
- *Always a flow list `[kate]`*: brackets live on the phone keyboard's secondary layer, paid
  on every post.
- *Free-text byline string*: no brackets, but produces "Kate and Tom" / "Kate & Tom" /
  "kate and tom" drift across a hundred posts, and makes FR-002d impossible.

---

## R5. URLs, slugs, and Māori place names

**Decision**: `permalink: /:year/:month/:day/:title/`. Post files are named
`_posts/YYYY-MM-DD-ascii-slug.md`, with the display title — macrons and all — in front
matter.

**Rationale**: the date-plus-slug permalink is stable for the life of the site (FR-002,
SC-009) and gives two posts written on the same day distinct URLs as long as their slugs
differ. Keeping the *filename* ASCII while the *title* carries full orthography means
`title: "Up the Whanganui"` and `title: "Tāngata Whenua"` render correctly in the page, the
listing, and the feed, while the URL stays clean and unambiguous when pasted into a message.

**Rejected**: `permalink: /:title/` — shorter, but two same-day posts with similar slugs
collide more easily and the date carries real meaning in a trail journal.

---

## R6. Typography — and a constitution catch

**Decision**: **Self-host** Roboto as woff2 files committed to the repository, with a
`font-face` declaration in the single stylesheet and a system sans-serif fallback stack.

**Rationale**: this one nearly slipped through. The obvious way to get Roboto is a Google
Fonts `<link>` — but that is a runtime dependency on a third-party service, which Principle I
prohibits ("no runtime dependency on any paid or account-gated third-party service beyond
GitHub itself and a public Google My Maps embed"), and it transmits every reader's IP address
to Google on every page view, which FR-022 prohibits. Self-hosting resolves both. Roboto is
Apache 2.0 licensed, so redistribution in the repository is permitted.

**Budget**: Roboto regular + bold, latin subset, woff2 ≈ 30–35 KB combined. Against the
100 KB per-page budget (SC-004) with ~10 KB of HTML and CSS, this fits with room to spare,
and the fonts are cached across pages after the first.

**Fallback**: `font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial,
sans-serif` so a failed font load degrades to the platform sans rather than to serif.

**Rejected**: *Google Fonts CDN* (violates Principle I and FR-022); *system stack only*
(free and fastest, but Roboto is an explicit design requirement).

---

## R7. Drafts (FR-010)

**Decision**: `published: false` in the post's front matter.

**Rationale**: native Jekyll, one line, and it removes the post from `site.posts`, which means
the listing and `jekyll-feed` both exclude it with no extra logic. The file stays in
`_posts/` and in the repository, which is what the requirement asks for.

**Rejected**: the `_drafts/` directory — Jekyll only renders it with a `--drafts` build flag
that GitHub Pages does not pass, so a draft there is invisible rather than merely unlisted,
and moving a file between directories is more work on a phone than editing one line.

---

## R8. Images (FR-012, FR-023)

**Decision**: images committed to `/img/` at the repository root, referenced as
`![descriptive alt text](/img/filename.jpg)`.

**Phone workflow**: GitHub's mobile web UI supports *Add file → Upload files*, so photos can
be added from a phone without a laptop.

**Honest limitation**: this is the weakest part of the phone publishing story. The mobile
upload flow is several taps, gives no resizing, and a full-resolution phone photo is 3–5 MB —
enough to blow SC-005's three-second budget on a 3G connection and to bloat the repository
over five months of walking. Mitigation is procedural rather than technical: resize to
≈1600 px on the long edge before uploading, using the phone's own share sheet or photo
editor. This is documented in the quickstart rather than solved in code, because solving it in
code would mean a build step (Principle III) or a third-party image host (Principle I).

**Rejected**: *an image CDN or hosted gallery* (third-party runtime dependency, Principle I);
*a Jekyll image-processing plugin* (not on GitHub Pages' allowed list, and would require a
custom workflow — R1).

---

## R9. Map embed (FR-013–015)

**Decision**: a `map.md` page containing the Google My Maps `<iframe>`, wrapped in a
CSS-only responsive container, immediately followed by a plain `<a>` link to the same map.

**Rationale**: My Maps is the one third-party embed the constitution explicitly permits. An
iframe is HTML, not JavaScript, so Principle II holds. The adjacent text link is what makes
the page survive a blocked or failed embed (FR-015), and is also what makes the page
meaningful with CSS and JS disabled (FR-005).

**Responsive approach**: a wrapper with `aspect-ratio: 4 / 3` and `width: 100%`, which needs
no JavaScript and no percentage-padding hack. Supported across all target browsers (FR:
current Safari, Chrome, Firefox).

**Map must be shared publicly** in My Maps settings, or the embed renders an error for
everyone but its owner — an easy and silent mistake, so it belongs in the quickstart
checklist.

---

## R12. Linking posts and map locations

**Decision**: posts carry an optional free-text `place` name and nothing more. Linking a map
location to a post is done from the Google My Maps app by pasting the post's URL into that
location's description (FR-014a). No coordinates are stored in the repository.

**Rationale**: the two directions are not symmetrical.

*Map → post* costs nothing and needs no site support at all — a pin description is just text
the author edits in the app, and it already sits exactly where a curious reader is looking.
One detail to verify by hand once the map exists: whether a URL in a pin description renders
as a tappable link or as plain text. Google's documentation does not say, and the support
threads on it are not retrievable. Either outcome is usable.

*Post → map* is only half-available. A My Maps embed accepts `ll=` to centre and `z=` to
zoom, but the parameter that opened a chosen marker's info window was removed when My Maps
was rebuilt, so a link from a post can put a reader near the right place but cannot open the
pin for them. Buying that partial result would cost latitude and longitude in every post's
front matter — looked up and typed on a phone, on trail, a hundred times. That trade is bad,
and it is the exact friction Principle III exists to prevent.

The free-text `place` line delivers most of what a reader actually wants — knowing where the
entry happened — for six characters of front matter and no lookup. An author who wants a real
map link on a particular post can paste one into the body; nothing prevents it.

**Alternatives rejected**:

- *`lat`/`lng` in front matter driving a "See on the map" link*: per-post cost too high for a
  link that cannot open the marker anyway.
- *A per-post embedded mini-map*: a third-party iframe on every post page, against Principle I
  and the SC-004 page-weight budget, to show what one line of text already conveys.
- *Geocoding the place name at build time*: needs a plugin outside GitHub Pages' allowed list,
  so it would force a custom workflow (R1).

---

## R10. Navigation

**Decision**: nav links listed in `_config.yml` and looped over in the layout.

**Rationale**: keeps the header in one place rather than duplicated across layouts. Principle
III's "must be generated rather than hand-maintained" applies to post-derived listings — the
journal index, archive, and feed — not to a three-item set of standing pages, which changes
approximately never.

---

## R11. Verification approach

**Decision**: no test framework. Verification is a written checklist run against the live
site, plus GitHub's own build status.

**Rationale**: there is no application logic to unit-test — the only executable code is a
handful of Liquid template lines. The failure modes that actually matter here are visual and
integrative: does it render at 320 px, does the byline say the right thing, does the feed
validate, does the map load. A test framework would add a dependency and a build step
(Principles III and V) to check things a person must look at anyway.

The constitution's requirement to verify at a narrow viewport is met by resizing a desktop
browser or using its device emulation.

**Local preview** (`bundle exec jekyll serve` with the `github-pages` gem) SHOULD be
available for whoever has a laptop, and MUST remain optional — nothing about publishing may
require it.

---

## R13. Covering more than one hike

**Decision**: the journal stays a single chronological stream. A hike is a **folder under
`_posts/`** plus an entry in a `hikes` list in `_config.yml`. A path-scoped front matter
default maps the folder to a `trip` label, and the map page loops over `hikes`, rendering one
map each, newest first.

**Rationale**: the requirement is that adding a hike costs a one-off configuration edit and
nothing per post (FR-002f, SC-008e). Path-scoped defaults do exactly this: a file dropped in
`_posts/wind-rivers/` inherits `trip: "Wind River Range"` with no front matter at all, and on
a phone the folder is chosen just by typing it into the filename in GitHub's editor. No new
layout, no new page, no navigation entry.

The map is the part that genuinely could not stay as it was. A single embed covering Wyoming
and New Zealand is zoomed out to open ocean, so `map_embed_url` became a per-hike pair of
URLs. A hike with no map yet is simply skipped rather than rendering an empty frame.

Note that `_posts/<folder>/` does **not** create a Jekyll category — categories come from
directories *above* `_posts`, not below it — so URLs stay clean and the permalink pattern is
untouched.

**Alternatives rejected**:

- *A `trip:` field in every post*: one more line to type on a phone, forever, for information
  the file's location already carries. Fails SC-008e's spirit.
- *A section, header, or index page per hike*: explicitly not wanted. At this post volume a
  single chronological list is honest and adequate, and interleaved entries from two hikes are
  acceptable rather than a defect.
- *Jekyll collections, one per hike*: gives per-hike indexes and permalinks, but each new hike
  would need a `_config.yml` collection block *and* a matching folder *and* would change post
  URLs. More machinery for grouping nobody asked for.
- *One My Maps map with a layer per hike*: no site change at all, but the default view has to
  centre somewhere, so every reader arrives zoomed out to a hemisphere.
- *Letting `place` carry the hike name* (`place: "Titcomb Basin, Wind River Range"`): free, and
  genuinely viable — but it repeats the hike name in every post by hand, and drifts.

---

## Sources

- GitHub Pages dependency versions — https://pages.github.com/versions/
- Configuring a publishing source — https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Creating a GitHub Pages site with Jekyll — https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll
- GitHub Pages now uses Actions by default — https://github.blog/news-insights/product-news/github-pages-now-uses-actions-by-default/
