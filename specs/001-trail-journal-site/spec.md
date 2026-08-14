# Feature Specification: Walking Journal Site

**Feature Branch**: `001-trail-journal-site`

**Created**: 2026-08-14

**Status**: Draft

**Input**: User description: "A simple public static site on GitHub Pages for our long
walks, at kateandtom.github.io. More than one hike — the Wind River Range in Wyoming first,
then Te Araroa. They can just be separate entries and locations; we don't need a whole new
header or group for each hike. Clean, minimal, text-first, modeled on
corinwagen.github.io — gray nav bar, Roboto. It needs a blog/journal section for posts we
want to share publicly, an about/intro page, and an embedded Google My Maps so people can
follow where we are. No CMS, no build complexity. Personal journaling stays private in the
Journal app on my phone; only what we choose goes on the site. No email or notification
system — people check it at their own accord."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A reader follows the journey (Priority: P1)

A friend, family member, or stranger who has heard about the hike arrives at the site.
They see the most recent trail posts newest-first on the home page, tap one, and read it
end to end. They can get back to the list and keep reading older entries. Nothing about
the experience requires them to sign in, install anything, or wait.

**Why this priority**: This is the entire reason the site exists. If a reader can land on
the site and read the journal, the site is delivering its value even with nothing else
built.

**Independent Test**: Publish two or three posts, open the site's root URL on a phone,
and confirm both posts are listed newest-first and each opens to a full, readable page.
Delivers the core value — people can follow the hike.

**Acceptance Scenarios**:

1. **Given** the site has published posts, **When** a reader opens the site root,
   **Then** posts are listed newest-first with title and date, each linking to its post.
2. **Given** a reader is on the post list, **When** they select a post,
   **Then** the full post renders with its title, date, and body text.
3. **Given** a reader is on a post page, **When** they look for navigation,
   **Then** a link back to the journal list and to the other top-level pages is visible.
4. **Given** a reader opens the site on a phone in portrait,
   **When** the page renders, **Then** body text is readable without horizontal scrolling
   or pinch-zoom.
5. **Given** a reader has images disabled or a slow connection,
   **When** a post loads, **Then** the text content is fully readable.

---

### User Story 2 - An author publishes from the trail (Priority: P1)

At a hut or a town stop, with only a phone and patchy signal, Kate or Tom writes an entry
and publishes it. They create one new file, type the entry, and commit. Within a few
minutes it is live, listed on the journal page, attributed to whoever wrote it, and
included in the feed. Neither of them ever edits an index, a menu, or an archive page.

**Why this priority**: Equal to P1 above — a site nobody can post to is as useless as a
site nobody can read. This is the constraint that most shapes the design, so it must be
proven early rather than discovered on trail.

**Independent Test**: From a mobile browser, create a new post file through the GitHub web
editor, commit it, wait for the deploy, and confirm it appears on the site under the right
byline with no other file edited. Delivers the ability to keep the journal alive for five
months.

**Acceptance Scenarios**:

1. **Given** an author is in a mobile browser with only GitHub's web editor,
   **When** they create one new post file and commit it,
   **Then** the post appears on the live site with no other file modified.
2. **Given** a post declares one author, **When** it renders and when it is listed,
   **Then** that author's byline is shown.
2a. **Given** a post declares both walkers as authors, **When** it renders and when it is
   listed, **Then** both names appear in the byline, in the declared order.
3. **Given** a new post is committed to the default branch,
   **When** the hosting platform finishes building,
   **Then** the post is live at a stable, permanent URL.
4. **Given** an author writes a post with a typo,
   **When** they edit that one file and commit,
   **Then** the correction appears at the same URL.
5. **Given** an author wants a post to be visible but not yet listed,
   **When** they mark it as a draft,
   **Then** it does not appear in the journal list or the feed.

---

### User Story 3 - A reader sees where they are right now (Priority: P2)

A reader wants to know how far along the trail they have got. They open the map page and
see an embedded map showing the route and progress markers. Kate updates that map from the
Google My Maps app on her phone; the site itself never changes.

**Why this priority**: This is the most-requested thing from people following a thru-hike,
but the journal works without it and it depends on a third-party embed, so it comes after
the reading and publishing loops are solid.

**Independent Test**: Add a point to the My Maps map from a phone, reload the site's map
page, and confirm the new point is visible without any commit to the repository.

**Acceptance Scenarios**:

1. **Given** the map page is published, **When** a reader opens it,
   **Then** an interactive map showing the route and current progress is displayed.
2. **Given** an author adds or moves a point in Google My Maps,
   **When** a reader reloads the map page,
   **Then** the change is reflected without any change to the site's files.
3. **Given** the map embed fails to load or is blocked,
   **When** a reader opens the map page,
   **Then** a visible text link to the map opens it directly in a new tab.
4. **Given** a reader opens the map page on a phone,
   **When** the map renders,
   **Then** it fits the viewport width and is pannable without trapping the page scroll.

---

### User Story 4 - A reader learns who they are and why (Priority: P2)

A reader who found a post through a link wants context. They open the about page and find a
short introduction: who Kate and Tom are, what Te Araroa is, why they are walking it, and
how to get in touch.

**Why this priority**: Converts an incidental reader into a following reader, but the
journal has standalone value without it.

**Independent Test**: Open the about page directly and confirm it explains the project and
offers a way to make contact.

**Acceptance Scenarios**:

1. **Given** a reader opens the about page, **When** it renders,
   **Then** it contains an introduction to both walkers and the hike.
2. **Given** a reader wants to get in touch, **When** they read the about page,
   **Then** a contact method is offered.

---

### User Story 5 - A reader subscribes instead of checking back (Priority: P3)

A reader adds the journal to a feed reader so new entries reach them without revisiting the
site.

**Why this priority**: A convenience for a minority of readers, and cheap to add once posts
are generated from files, but not required for launch.

**Independent Test**: Point a feed reader at the site's feed URL and confirm recent posts
appear with titles, dates, and content or summaries.

**Acceptance Scenarios**:

1. **Given** published posts exist, **When** a feed reader requests the feed URL,
   **Then** it returns a valid feed listing recent posts newest-first.
2. **Given** a new post is published, **When** the feed is next fetched,
   **Then** the new post is present in the feed.

---

### Edge Cases

- **No posts yet**: Before the hike begins, the journal list must render an intentional
  empty state rather than a broken or blank page.
- **A very long post with many photos**: Must remain readable and must not push page weight
  to the point of failing on a slow mobile connection; image handling must be defined.
- **Special characters in a title**: Apostrophes, macrons, and Māori place names
  (e.g. Whanganui, Tāngata) must render correctly in titles, URLs, listings, and the feed.
- **Two posts written on the same day**: Both must be listed and must resolve to distinct,
  stable URLs.
- **A commit made from a phone with a malformed post header**: The failure must be visible
  to the author rather than silently producing a broken or missing page.
- **Map embed blocked**: Some readers' browsers or networks block third-party embeds; the
  map page must degrade to a working link.
- **Bad connectivity**: A reader on a 3G connection in a valley must still get readable text
  quickly.
- **Old link shared on social media**: Post URLs must not change once published.
- **A post with no author declared**: Must still publish, falling back to the site-level
  default byline rather than rendering an empty or broken attribution.
- **Both walkers publish on the same day**: Both posts must appear, correctly attributed,
  at distinct URLs.
- **A post co-written by both walkers**: Must render one byline naming both, not two
  separate bylines or a duplicated entry in the listing.
- **A post by a guest** (a friend who walks a section with them): Must render that person's
  name without requiring a template change.
- **A post with no place declared**: Must render cleanly, with no empty location line,
  stray separator, or "undefined" text.
- **A post outside any hike folder**: Must publish normally, carrying no hike label rather
  than an empty one — a walk that isn't part of a named trip is still a valid entry.
- **Two hikes running in the same period, or a hike revisited years later**: The journal
  stays strictly chronological; entries from different hikes may interleave, and that is
  acceptable. No grouping, section, or per-hike index is required.
- **A hike with no map yet**: Must be absent from the map page rather than rendering an
  empty frame.
- **An author name misspelled in a post's front matter**: Must fail visibly to the author
  rather than silently producing a blank or literal-key byline.

## Requirements *(mandatory)*

### Functional Requirements

**Reading**

- **FR-001**: The site MUST present a journal listing of published posts ordered
  newest-first, each entry showing at minimum its title, date, and author(s), and linking
  to the post.
- **FR-002**: Each post MUST render as its own page at a stable, permanent URL that does
  not change when later posts are published.
- **FR-002a**: Each post page MUST display a byline identifying its author or authors. A
  post MUST support one author, both walkers, or a guest contributor.
- **FR-002b**: Where a post has more than one author, the byline MUST render all of them as
  readable prose (e.g. "Kate and Tom"), in the order the post declares them, in both the
  post page and the journal listing.
- **FR-002c**: A post that declares no author MUST still publish, falling back to a
  site-level default byline rather than rendering an empty or broken attribution.
- **FR-002d**: The set of possible authors MUST be defined in configuration, so adding a
  guest contributor is a configuration change and never a template or code change.
- **FR-002e**: A post MUST be able to declare an optional free-text place name, which the
  site displays alongside the post's date and byline on both the post page and the journal
  listing. A post that declares no place MUST render normally, with no empty label or
  leftover punctuation.
- **FR-002f**: A post MUST be able to carry a hike label identifying which walk it belongs
  to. The label MUST be derived from where the post file sits, so that it costs nothing per
  post — starting a new hike may cost a one-off configuration edit, but writing an entry
  within that hike MUST NOT.
- **FR-002g**: Where a post has both a place and a hike label, the two MUST render as one
  readable phrase rather than as separate labelled fields. Either may be absent, and any
  combination of the two — including neither — MUST render with no stray separator.
- **FR-003**: Every page MUST display navigation linking to the journal, the about page, and
  the map page.
- **FR-004**: The site MUST render legibly on a phone-width viewport without horizontal
  scrolling.
- **FR-005**: All text content MUST be readable with CSS and JavaScript disabled.
- **FR-006**: The journal listing MUST render an intentional empty state when no posts are
  published.

**Publishing**

- **FR-007**: Publishing a post MUST require creating exactly one new file and committing
  it; no index, archive, navigation, or listing file may require a manual edit.
- **FR-008**: Publishing MUST be completable entirely from a mobile web browser, with no
  locally installed tooling and no build step run by the author.
- **FR-009**: The journal listing, the map page link, and the feed MUST be generated from
  post files rather than hand-maintained.
- **FR-010**: A post MUST be markable as a draft such that it is excluded from the listing
  and the feed while remaining in the repository. A draft is *unlisted, not private* — the
  repository is public, so draft text is readable by anyone who browses it. Anything genuinely
  private belongs in the phone's Journal app and MUST NOT be committed.
- **FR-011**: Post content MUST be authored in Markdown, with post metadata limited to
  fields the site actually renders.
- **FR-012**: A post MUST be able to include images, and the image workflow MUST be
  documented and completable from a phone.

**Map**

- **FR-013**: The site MUST provide a map page displaying, for each hike, an embedded
  interactive map of that hike's route and progress. Maps MUST be per-hike rather than
  combined: a single map spanning multiple continents is zoomed out to uselessness.
- **FR-013a**: The map page MUST order hikes newest-first and MUST render an intentional
  message, not a broken page, when no hike yet has a map.
- **FR-014**: Updating a map's contents MUST NOT require any change to the site's files.
- **FR-014b**: Adding a hike MUST be a configuration change only — no new layout, template,
  page, or navigation entry.
- **FR-014a**: Linking a map location to a post MUST be achievable by editing the map alone —
  placing the post's URL in that location's description in Google My Maps — with no change
  to the site's files and no coordinates recorded in the repository.
- **FR-015**: Every map on the page MUST be accompanied by a visible text link that opens
  that map directly, so the page remains useful if an embed fails or is blocked.

**About**

- **FR-016**: The site MUST provide an about page introducing both walkers and the hike and
  offering at least one way to make contact.

**Feed**

- **FR-017**: The site MUST publish a feed of recent posts at a stable URL, including each
  post's title, date, author(s), permanent link, and content or summary.
- **FR-017a**: The site MUST NOT collect email addresses, operate a mailing list, or send
  notifications of any kind. Readers visit the site or use the feed at their own initiative.

**Presentation & platform**

- **FR-018**: The site MUST use a simple horizontal gray navigation bar and a single
  readable content column, consistent with the reference design.
- **FR-019**: The site MUST use Roboto with a system sans-serif fallback, so it renders
  correctly if the webfont fails to load.
- **FR-020**: Each page MUST have a descriptive title and a description suitable for link
  previews when shared.
- **FR-021**: The site MUST be served over HTTPS at `https://kateandtom.github.io`, using
  GitHub Pages' free hosting for a user or organization site. The design MUST NOT depend on
  this URL, so a custom domain remains possible later without rework.
- **FR-022**: The site MUST NOT collect reader personal data, require sign-in, or include
  advertising or third-party tracking.
- **FR-023**: Content images MUST carry meaningful alternative text, and body text MUST meet
  WCAG AA contrast against its background.

**Privacy**

- **FR-024**: Only content the author explicitly commits to the repository may appear on the
  site; no private journal content may be ingested from any other source.
- **FR-024a**: The repository MUST be public — GitHub Pages does not serve private
  repositories on the free plan, and SC-010 forbids a paid plan. Consequently the full commit
  history is public: text that is committed and later deleted remains readable in history.
  Authors MUST treat every commit as permanent and public.
- **FR-025**: The map MUST show progress at a granularity the author controls, and MUST NOT
  publish continuous or automatic real-time location.

### Key Entities

- **Post**: One dated journal entry. Attributes: title, publication date, one or more
  authors, optional place name, optional hike label, body content, optional images, draft
  flag, permanent URL. Ordered relative to other posts by date, across all hikes.
- **Hike**: One long walk the journal covers — Wind River Range, Te Araroa. Attributes:
  display name, region, and its own map references. Defined in configuration. Posts belong
  to a hike by where their file sits, not by a field they declare.
- **Author**: A person who writes posts — ordinarily Kate or Tom, but the set is defined in
  configuration so a guest contributor can be added without touching templates.
  Attributes: display name. A post references one or more authors to produce its byline.
- **Page**: A standing, undated page (about, map). Attributes: title, body content, position
  in navigation.
- **Site**: The whole publication. Attributes: title, author names, description, base URL,
  navigation set, map embed reference.
- **Map**: The externally-hosted route and progress map. Attributes: embed reference, direct
  link. Owned and edited outside the repository.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Either walker can publish a new post from a phone, start to finish, in under
  5 minutes on a usable connection, touching exactly one file.
- **SC-002**: A published post is live and listed within 10 minutes of the commit, with no
  manual step beyond the commit.
- **SC-003**: A new reader landing on the site root can reach the full text of the most
  recent post in one interaction.
- **SC-004**: Any page, excluding images, transfers under 100 KB.
- **SC-005**: A post page becomes readable within 3 seconds on a simulated 3G connection.
- **SC-006**: Every page renders without horizontal scrolling at a 320 px viewport width.
- **SC-007**: Every page's text content remains complete and readable with CSS and
  JavaScript disabled.
- **SC-008**: An author can change what the map shows without committing anything to the
  repository.
- **SC-008a**: A reader can determine who wrote any given post — one walker, both, or a
  guest — without opening the repository.
- **SC-008b**: Declaring a co-written post adds no more than one short line of front matter
  compared with a single-author post, and is typeable on a phone keyboard.
- **SC-008c**: A reader can see roughly where on the trail a post was written, for those
  posts where the author chose to say, without leaving the page.
- **SC-008d**: An author can link a map location to a post entirely from the Google My Maps
  app, with no commit to the repository.
- **SC-008e**: Adding a new hike costs one configuration edit and no per-post effort
  thereafter, and requires no change to any layout or template.
- **SC-009**: Post URLs published at launch still resolve unchanged at the end of the hike.
- **SC-010**: Total recurring cost to run the site is zero.

## Assumptions

- The site is public and unauthenticated; there is no private or gated content on it.
  Private journaling lives entirely in the phone's Journal app and is out of scope.
- The site covers multiple long walks over time, beginning with the Wind River Range in
  Wyoming and then Te Araroa in New Zealand. A single chronological journal is adequate;
  entries from different hikes may sit next to each other, and no per-hike section, header,
  archive, or navigation entry is wanted.
- The site is written by two walkers, Kate and Tom, who publish posts individually and
  jointly. Posts are attributed by name; a post with no attribution falls back to the site
  default of both names, on the assumption that an unattributed post speaks for the pair.
  Guest contributors are supported but expected to be rare. Hosting
  lives under a free GitHub **organization** named `kateandtom`, so each walker uses their
  own personal GitHub login rather than sharing one account. The name was confirmed
  available on 2026-08-14; if it is taken before setup, the URL must be re-decided.
- The repository is public and named `kateandtom.github.io`, published by GitHub Pages from
  the default branch — the free plan covers this, including HTTPS. Public is not optional:
  GitHub Pages serves private repositories only on Pro, Team, or Enterprise plans, which
  SC-010 rules out.
- Readers are predominantly on mobile devices, often on poor connections; desktop is
  supported but not the design target.
- Readers pull rather than get pushed to: they visit the site or use the feed when they feel
  like it. There is deliberately no mechanism to notify anyone of a new post.
- Post volume over the hike is on the order of dozens to low hundreds of entries — small
  enough that a single chronological listing is adequate.
- The map is maintained by hand in Google My Maps at the authors' discretion; there is no
  GPS device integration and no automatic tracking.
- Photo volume is modest and photos can be committed to the repository; large-scale media
  hosting is out of scope.
- The visual reference is corinwagen.github.io for layout and typography only; its
  implementation is not being copied.

## Out of Scope

Deliberately excluded from this feature. Each may be revisited later, but nothing in the
design may assume them.

- **Reader comments.** Considered and deferred on 2026-08-14. Every option requires storing
  reader content somewhere GitHub Pages cannot, and each candidate failed on a different
  count: GitHub-Discussions-backed comments (giscus) require every commenter to hold a
  GitHub account, which excludes most of the intended audience; the lightweight
  no-account alternative (Cusdis) has been unmaintained since 2021 and fails the boring
  technology principle; hosted commenting (Disqus) brings advertising and tracking,
  violating FR-022. If comments are added later, the preferred route is a
  no-JavaScript HTML form that emails submissions to the authors, who curate selected
  notes into the post body — keeping reader content in the repository and avoiding an
  unmoderated spam surface that cannot be policed from the trail.
- **Email notifications and mailing lists.** Explicitly rejected as too much ongoing effort
  for the value; see FR-017a. Readers check the site at their own accord.
- **Analytics, reader tracking, and advertising.** Excluded by FR-022.
- **Search, tags, categories, and pagination.** Post volume does not warrant them.
- **Coordinates in post front matter, and automatic post-to-map deep links.** Considered and
  rejected on 2026-08-14. Google My Maps embeds accept `ll=` and `z=` parameters to centre
  and zoom, but Google removed the parameter that opened a specific pin's info window when
  My Maps was rebuilt, so a post could only ever drop a reader near the right place rather
  than on the marker. Against that limited payoff, recording latitude and longitude would
  mean looking coordinates up and typing them on a phone for every post, which is precisely
  the friction Principle III exists to prevent. The free-text `place` name of FR-002e gives
  most of the reader value at none of that cost, and the reverse direction — a post URL
  inside a map pin's description, FR-014a — is available immediately with no site support at
  all. An author who wants a map link on a particular post can paste one into the body.
- **A custom domain.** Optional and deferred; FR-021 keeps it possible without rework.
- **Multi-language content.** English only.
