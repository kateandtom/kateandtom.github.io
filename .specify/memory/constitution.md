<!--
Sync Impact Report
==================
Version change: 1.0.1 → 1.1.0
Rationale: MINOR. Scope materially expanded — the site now covers multiple long-distance
hikes rather than Te Araroa alone, which changes the Maps constraint from one map to one
map per hike. No principle added, removed, or redefined.

Modified principles: none. Technical Constraints amended (Maps); document retitled.

Prior: 1.0.0 → 1.0.1 (PATCH) corrected single-author phrasing to two walkers and named
the confirmed hosting URL.

Added sections:
  - Core Principles (5): Static & Serverless, Text-First Minimalism,
    Publish From Anywhere, Own the Content, Boring Technology
  - Technical Constraints
  - Development Workflow
  - Governance

Removed sections: none

Follow-up TODOs: none
-->

# Walking Journal Constitution

## Core Principles

### I. Static & Serverless (NON-NEGOTIABLE)

The site MUST be a collection of static files served by GitHub Pages. There MUST be
no application server, no database, and no runtime dependency on any paid or
account-gated third-party service beyond GitHub itself and a public Google My Maps
embed.

Rationale: The authors will be walking thousands of kilometres with intermittent
connectivity and no laptop, across more than one trip. Anything that can go down, expire,
or require maintenance while they are on a mountain is a liability. Static files on GitHub
Pages will still be serving five years from now with zero intervention.

### II. Text-First Minimalism

Every page MUST be readable and complete with CSS and JavaScript disabled. The site
MUST NOT use a CSS framework, a JavaScript framework, or a client-side router.
Total page weight excluding images MUST stay under 100 KB. Custom CSS MUST live in a
single stylesheet. JavaScript is permitted only where no HTML/CSS equivalent exists,
and each use MUST be justified in the plan.

Rationale: The visual model is corinwagen.github.io — a gray nav bar, Roboto, and
prose. Readers on a phone with two bars of signal are the primary audience, not
readers on a desktop with fibre.

### III. Publish From Anywhere

Publishing a new post MUST require only: create one Markdown file, commit, push. It
MUST be possible from the GitHub web editor on a phone, with no local toolchain, no
build step run by the author, and no manual index or archive page to update. Any
index, archive, RSS feed, or navigation listing MUST be generated from post files
rather than hand-maintained.

Rationale: On trail there is no laptop. If publishing is harder than typing into a
text box, the blog dies in week two. This applies to both walkers independently —
neither may depend on the other being present or online in order to post. It also applies
across hikes: starting a new trip may cost a one-off configuration edit, but MUST NOT add
any per-post cost.

### IV. Own the Content

All posts and pages MUST be plain Markdown or HTML committed to the repository.
Content MUST NOT be stored only in a CMS, a hosted service, or a proprietary format.
Post front matter MUST be limited to fields the site actually renders. Images MUST be
committed to the repository or linked from a URL the author controls.

Rationale: The repository is the archive. It should be readable as a trail journal by
a human with a text editor long after the site itself is gone.

### V. Boring Technology

New dependencies, plugins, and build tooling MUST be justified against a plainer
alternative before adoption. Where GitHub Pages provides a capability natively, the
native capability MUST be preferred over an equivalent third-party one. Configuration
MUST be explicit and committed; nothing may depend on state that exists only in a
developer's machine or a service dashboard.

Rationale: Complexity is paid for later, from a hut, on a phone, in the rain.

## Technical Constraints

- **Hosting**: GitHub Pages, served from the public repository `kateandtom.github.io`
  under a free GitHub organization named `kateandtom`, at https://kateandtom.github.io.
  Each walker MUST publish using their own GitHub login; shared credentials are not
  acceptable. A custom domain is optional and MUST remain optional — no design decision
  may depend on which URL is in use.
- **Generator**: Jekyll, built by GitHub Pages' native build. An author MUST NOT be
  required to run a build locally in order to publish. A local preview path SHOULD
  exist but MUST be optional.
- **Typography**: Roboto, with a system sans-serif fallback stack so the site renders
  correctly if the webfont fails to load.
- **Layout**: A simple gray navigation bar, a single readable content column, and no
  fixed-position or overlay elements.
- **Scope**: The site is a journal of long walks, not of one walk. Nothing in the design
  may assume a single trip, a single country, or a single date range. Adding a hike MUST
  be a configuration change, never a template or layout change.
- **Maps**: Location tracking via embedded public Google My Maps iframes, **one map per
  hike** — a single map spanning several continents is zoomed out to uselessness. Each map
  MUST be editable from the Google My Maps app without any change to the site, and a text
  fallback link MUST accompany every embed.
- **Reader contact**: The site MUST NOT collect reader email addresses, operate a mailing
  list, or send notifications. Readers visit at their own initiative. Comments are out of
  scope; if ever added, they MUST NOT introduce advertising, tracking, or an unmoderated
  public write surface.
- **Browser support**: Current versions of mobile and desktop Safari, Chrome, and
  Firefox. No support burden is accepted for older browsers.
- **Accessibility**: Semantic HTML, meaningful `alt` text on content images, and body
  text meeting WCAG AA contrast against its background.

## Development Workflow

- Work follows the Spec Kit flow: constitution → specify → plan → tasks → implement.
- Every feature MUST have a spec under `specs/` before implementation begins.
- The `main` branch MUST always be deployable; GitHub Pages publishes from it.
- Changes MUST be verified by viewing the rendered page, not only by reading the diff.
  Verification MUST include a narrow (mobile-width) viewport.
- A change that adds a dependency, a build step, or a JavaScript file MUST state in
  its plan which principle permits it.

## Governance

This constitution supersedes ad-hoc preferences and default framework conventions.
When a tool's convention conflicts with a principle here, the principle wins or the
tool is replaced.

Amendments MUST be made by editing this file, with the version bumped according to
semantic versioning: MAJOR for removing or redefining a principle, MINOR for adding a
principle or materially expanding guidance, PATCH for clarifications and wording. Each
amendment MUST update the Sync Impact Report comment at the top of this file and the
Last Amended date below.

Compliance is reviewed at the `/speckit-plan` step: any plan that violates a principle
MUST either be revised or accompanied by an explicit, written justification recorded in
the plan's Complexity Tracking section. Silent exceptions are not permitted.

**Version**: 1.1.0 | **Ratified**: 2026-08-14 | **Last Amended**: 2026-08-14
