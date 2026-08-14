---

description: "Task list for the Te Araroa trail journal site"
---

# Tasks: Walking Journal Site

**Input**: Design documents from `/specs/001-trail-journal-site/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: No automated test tasks. The spec requests none, and research R11 records why a test
framework is the wrong tool here — the failure modes are visual and integrative. Verification
tasks below check rendered output against the contracts instead, and they are not optional.

**Organization**: Grouped by user story so each phase is independently shippable.

## Status — 2026-08-14

Phases 1–2 and most of Phase 3 are built and on disk, plus the Phase 4 configuration and the
Phase 6 pages. Not yet pushed to GitHub.

**What was verified, and how honestly**: the site could not be built with Jekyll during
implementation — `rubygems.org` was unreachable from the build environment, so `github-pages`
could not be installed. Two substitutes were used instead:

- The byline include was run against **all ten contract cases C1–C10 using a Liquid engine**,
  and all ten pass. This is strong evidence but not conclusive: it is not Jekyll's Ruby Liquid.
  **T025 must still be re-run against the live site.**
- The real layouts and stylesheet were rendered and screenshotted at 320 px and 900 px. No
  horizontal overflow at either width, and the unstyled render is fully readable — which is
  T020 and T021 evidence, again from a render rather than from Jekyll.

Everything marked `[x]` below was written and reviewed; nothing has been confirmed against a
real GitHub Pages build. The first push is the real test.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1–US5, mapping to the user stories in spec.md
- Paths are relative to the repository root of `kateandtom.github.io`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the repository and make GitHub Pages serve something.

- [ ] T001 Create repository `kateandtom.github.io` under the `kateandtom` organization, default branch `main`, and set its visibility to **Public** in Settings → General → Danger Zone — GitHub Pages does not serve private repositories on the free plan (FR-024a, SC-010)
- [ ] T002 In repository Settings → Pages, set the source to **Deploy from a branch**, `main`, `/ (root)` per research R1; confirm no `.github/workflows/` file exists or is created
- [ ] T003 Add both walkers to the organization with write access to the repository, each using their own GitHub login (constitution: Technical Constraints)
- [x] T004 [P] Create `_config.yml` with `title`, `description`, `url: https://kateandtom.github.io`, `baseurl: ""`, `author`, and `plugins: [jekyll-feed, jekyll-seo-tag]` per data-model "Entity: Site"
- [x] T005 [P] Create `.gitignore` ignoring `_site/`, `.jekyll-cache/`, `Gemfile.lock`
- [x] T006 [P] Create `README.md` stating what the site is, that it publishes from `main` with no build step, and linking to `specs/001-trail-journal-site/quickstart.md`
- [x] T007 [P] Create optional `Gemfile` containing `gem "github-pages", group: :jekyll_plugins` for local preview only, and note in `README.md` that publishing never requires it

**Checkpoint**: `https://kateandtom.github.io` resolves over HTTPS and serves something, even if empty.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The page shell, the stylesheet, and the byline machinery that both P1 stories need.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T008 [P] Download Roboto regular and bold, latin subset, as woff2 and commit to `assets/fonts/` — self-hosted, not Google Fonts, per research R6 (Principle I and FR-022)
- [x] T009 Create `assets/style.css` as the single stylesheet: `@font-face` rules for the committed woff2 files, the fallback stack `Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`, gray nav bar, single readable content column, and body text meeting WCAG AA contrast (FR-018, FR-019, FR-023)
- [x] T010 [P] Create `_data/authors.yml` mapping `kate: Kate` and `tom: Tom` per data-model "Entity: Author" (FR-002d)
- [x] T011 Create `_includes/byline.html` implementing the rendering rules in `contracts/post-frontmatter.md`: normalise string-or-list, fall back to the config default, map keys through `_data/authors.yml`, emit an unknown key raw, and join as `A` / `A and B` / `A, B and C` (FR-002a, FR-002b, FR-002c)
- [x] T012 [P] Create `_includes/head.html` with charset, viewport, `{% seo %}`, the stylesheet link, and the feed autodiscovery link (FR-020)
- [x] T013 [P] Create `_includes/nav.html` rendering the gray nav bar by looping over `site.nav` from `_config.yml`; add the `nav` list to `_config.yml` with Journal, About, and Map (FR-003, research R10)
- [x] T014 Create `_layouts/default.html` — document shell including `head.html` and `nav.html`, a content slot, and a minimal footer (depends on T012, T013)

**Checkpoint**: A page rendered through `default.html` shows the nav bar in Roboto at the correct width.

---

## Phase 3: User Story 1 - A reader follows the journey (Priority: P1) 🎯 MVP

**Goal**: A reader lands on the site, sees posts newest-first, and can read any of them end to end on a phone.

**Independent Test**: Publish two or three posts, open the site root on a phone, and confirm both are listed newest-first and each opens to a full readable page.

- [x] T015 [P] [US1] Create `_layouts/post.html` — title, date, byline via `{% include byline.html %}`, optional place line, body, and a link back to the journal (FR-002, FR-002a, FR-002e, FR-003)
- [x] T016 [P] [US1] Create `_layouts/home.html` — posts newest-first, each showing title, date, author(s) and place, linking to the post (FR-001)
- [x] T017 [US1] Add the empty-state branch to `_layouts/home.html` for when no posts are published, rendering an intentional message rather than a blank page (FR-006)
- [x] T018 [P] [US1] Create `index.html` with `layout: home` and `permalink: /` (FR-001)
- [x] T019 [P] [US1] Create two example posts in `_posts/` on different dates to exercise ordering and linking
- [ ] T020 [US1] Verify at 320 px viewport width: no horizontal scrolling, body text readable without pinch-zoom (FR-004, SC-006)
- [ ] T021 [US1] Verify with CSS and JavaScript disabled that every page's text content is complete and readable (FR-005, SC-007)
- [ ] T022 [US1] Verify a reader reaches the full text of the most recent post in one interaction from the site root (SC-003)

**Checkpoint**: The journal is readable by anyone. This is the MVP — shippable on its own.

---

## Phase 4: User Story 2 - An author publishes from the trail (Priority: P1)

**Goal**: Either walker publishes a post from a phone by creating one file, with correct attribution and a stable URL.

**Independent Test**: From a mobile browser, create a post file in the GitHub web editor, commit, and confirm it appears under the right byline with no other file edited.

- [x] T023 [US2] Add `defaults` to `_config.yml` setting `layout: post` and `authors: [kate, tom]` for everything in `_posts/`, so a co-written post declares nothing (FR-002c, SC-008b, research R4)
- [x] T024 [US2] Add `permalink: /:year/:month/:day/:title/` to `_config.yml` (FR-002, SC-009, research R5)
- [x] T025 [US2] Verify the byline against all ten cases C1–C10 in `contracts/post-frontmatter.md`, on both the post page and the journal listing — including C9 (unknown key renders raw, never blank) and C10 (empty value falls back to the default)
- [ ] T026 [US2] Verify the location line against cases L1–L9 in `contracts/post-frontmatter.md` — including L5 (`place, trip` as one phrase) and L8 (neither present, no stray separator) (FR-002e, FR-002g)
- [ ] T026a [US2] Verify a post in `_posts/wind-rivers/` inherits the "Wind River Range" label with no `trip` field written, and that a post directly in `_posts/` carries no label (FR-002f, SC-008e)
- [ ] T027 [US2] Verify draft handling against cases P1–P3: `published: false` removes the post from the listing, the feed, and the built site at once (FR-010)
- [ ] T028 [US2] Verify URL cases U1–U3: title edits do not change the URL, a macron title with an ASCII filename resolves correctly, and two same-day posts get distinct URLs (FR-002, SC-009)
- [ ] T029 [US2] Publish a test post end to end from a phone using only the GitHub web editor, timing it against the 5-minute and one-file targets, then delete it (SC-001, SC-002, FR-007, FR-008)
- [ ] T030 [US2] Confirm a malformed front matter commit surfaces a visible red build failure on the repository page, and that the message identifies the file — then document what it looked like in `quickstart.md` if it differs from what is written there

**Checkpoint**: Both walkers can publish independently from a phone. Together with Phase 3 this is the complete P1 product.

---

## Phase 5: User Story 3 - A reader sees where they are right now (Priority: P2)

**Goal**: A map page shows the route and progress, updated from the My Maps app with no commit.

**Independent Test**: Add a point in My Maps from a phone, reload the map page, and confirm it appears without any repository change.

- [ ] T031 [US3] Create a Google My Maps map for the Wind River Range, add an initial point, and set its sharing to **public**; repeat per hike (FR-014)
- [ ] T032 [US3] Fill in `embed_url` and `link_url` for each entry in the `hikes` list in `_config.yml` — these are two different strings from My Maps (data-model "Entity: Site")
- [x] T033 [US3] Create `map.md` with `layout: page`, `permalink: /map/`, looping over `site.hikes` to render one iframe per hike newest-first, each followed by a visible text link, with an intentional message when no hike has a map yet (FR-013, FR-013a, FR-015)
- [x] T034 [US3] Add the responsive map container to `assets/style.css` using `aspect-ratio: 4 / 3` and `width: 100%` — CSS only, no JavaScript (FR-018, research R9, Principle II)
- [ ] T035 [US3] Verify from a logged-out browser that each embed renders for a non-owner, and that the map page fits a phone viewport without trapping page scroll (FR-014, spec edge case)
- [ ] T036 [US3] Verify the fallback: with the embed blocked, the text link still opens the map (FR-015)
- [ ] T037 [US3] Paste a post URL into a My Maps pin description and record whether it renders tappable or as plain text; update `quickstart.md` with the answer (FR-014a, research R12)

**Checkpoint**: Readers can follow progress, and map pins can point at posts.

---

## Phase 6: User Story 4 - A reader learns who they are and why (Priority: P2)

**Goal**: An about page gives context and a way to make contact.

**Independent Test**: Open the about page directly and confirm it explains the project and offers a contact method.

- [x] T038 [P] [US4] Create `_layouts/page.html` for undated standing pages — title and body through `default.html`
- [x] T039 [US4] Create `about.md` with `layout: page`, `permalink: /about/`, an introduction to both walkers and to Te Araroa, why they are walking it, and a contact method (FR-016)

**Checkpoint**: An incidental reader can find out who is walking and why.

---

## Phase 7: User Story 5 - A reader subscribes instead of checking back (Priority: P3)

**Goal**: A feed reader can follow the journal.

**Independent Test**: Point a feed reader at the feed URL and confirm recent posts appear with titles, dates, and content.

- [ ] T040 [US5] Confirm `jekyll-feed` is active and `/feed.xml` builds, with `title`, `description`, `url` and `author` set correctly in `_config.yml` for feed metadata (FR-017)
- [ ] T041 [US5] Verify the feed includes each post's title, date, author(s), permanent link, and content or summary, and that a `published: false` post is absent from it (FR-017, FR-010)
- [ ] T042 [US5] Verify the feed opens without error in a feed reader, and that a newly published post appears on the next fetch

**Checkpoint**: All five user stories are independently functional.

---

## Phase 8: Polish & Cross-Cutting Concerns

- [ ] T043 [P] Verify every page has a descriptive title and description suitable for link previews, by pasting a post URL into a messaging app (FR-020)
- [ ] T044 Measure transferred page weight excluding images and confirm it is under 100 KB, fonts included (SC-004)
- [ ] T045 Measure time to readable text on a simulated 3G connection and confirm it is under 3 seconds (SC-005)
- [ ] T046 [P] Confirm body text meets WCAG AA contrast against its background, and that every content image carries meaningful alt text (FR-023)
- [ ] T047 [P] Confirm the site sets no cookies, loads no analytics or advertising, and makes no third-party request other than the My Maps iframe on `/map/` — this is the check that catches an accidental Google Fonts link (FR-022, Principle I)
- [ ] T048 Add the real first Wind River Range post and remove the example posts from T019
- [ ] T049 Work through the "Before launch" checklist in `quickstart.md` end to end
- [ ] T050 Confirm total recurring cost is zero: no paid plan, no domain, no third-party subscription (SC-010)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies; T001 → T002 → T003 are sequential, T004–T007 are parallel
- **Foundational (Phase 2)**: depends on Setup; **blocks all user stories**
- **US1 (Phase 3)** and **US2 (Phase 4)**: both depend only on Foundational. Together they are the P1 product
- **US3 (Phase 5)**, **US4 (Phase 6)**, **US5 (Phase 7)**: depend only on Foundational; independent of each other and of US1/US2
- **Polish (Phase 8)**: depends on the stories being delivered

### Notable within-phase dependencies

- T014 (`default.html`) depends on T012 and T013
- T011 (byline include) depends on T010 (`_data/authors.yml`)
- T017 (empty state) edits the file created by T016 — not parallel with it
- T025 and T026 depend on T011 and on US1's layouts existing
- T034 edits `assets/style.css` created in T009 — not parallel with other CSS work
- T037 depends on T031 (the map must exist) and on at least one published post

### Parallel Opportunities

- T004, T005, T006, T007 — four different files, no interdependencies
- T008, T010, T012, T013 — fonts, author data, and two includes
- T015, T016, T018, T019 — post layout, home layout, index, example posts
- T043, T046, T047 — three independent verification passes

---

## Parallel Example: Phase 2 Foundational

```text
Task: "Commit Roboto woff2 files to assets/fonts/"          # T008
Task: "Create _data/authors.yml"                            # T010
Task: "Create _includes/head.html"                          # T012
Task: "Create _includes/nav.html"                           # T013
```

---

## Implementation Strategy

### MVP scope

**Phases 1–3 (T001–T022)** deliver the MVP: a readable journal at the real URL. Suggested MVP
scope is User Story 1 alone.

In practice **Phase 4 should follow immediately**. US1 and US2 are both P1 for a reason — a
journal that can be read but not posted to from a phone is not yet usable for its actual
purpose, and T029 is the task that proves the whole design works before the walking starts.

### Incremental delivery

1. Setup + Foundational → the site exists at its real URL
2. US1 → readable journal → **MVP, shippable**
3. US2 → publishing from a phone proven → **the real product**
4. US3 → map
5. US4 → about page
6. US5 → feed
7. Polish → the launch checklist

### Sequencing note

T001–T003 are the only tasks requiring account-level permissions on the `kateandtom`
organization, and everything else is blocked behind them. Do them first, in one sitting.

---

## Notes

- 50 tasks: 7 setup, 7 foundational, 8 in US1, 8 in US2, 7 in US3, 2 in US4, 3 in US5, 8 polish
- Verification tasks are real tasks, not optional extras — they are how a site with no test
  suite stays correct
- Commit after each task or logical group
- Every phase ends at a checkpoint where the site is in a working, deployable state
