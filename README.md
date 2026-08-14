# kateandtom.github.io

Our walking journal — https://kateandtom.github.io

Covers more than one hike. Entries are just dated files in one chronological journal;
each hike gets its own folder under `_posts/` and its own map.

## How it publishes

GitHub Pages builds this site itself from the `main` branch (Settings → Pages →
Deploy from a branch → `main` → `/`). There is no workflow file and no build step.
**Commit a Markdown file to `_posts/` and it's live in a couple of minutes.**

That's deliberate: it has to be possible from a phone, at a hut, on bad signal.

## Posting

See [the quickstart](specs/001-trail-journal-site/quickstart.md). Short version:

```
_posts/wind-rivers/2026-08-20-short-slug.md

---
title: "Into Titcomb Basin"
place: "Titcomb Basin"   # optional
authors: kate            # optional — leave out for a joint post
---

Words.
```

The **folder** sets which hike the entry belongs to — `_posts/wind-rivers/` labels it
"Wind River Range" automatically. Starting a new hike means adding one block to
`_config.yml` under `defaults`, then a matching folder. Nothing per post.

`published: false` keeps a post off the site. **A draft is unlisted, not private** —
this repo is public and its history is permanent.

## Layout

| Path | What |
|---|---|
| `_config.yml` | Site settings, nav, the `hikes` list (one map each), front matter defaults |
| `_data/authors.yml` | key → display name; add a guest here |
| `_includes/` | `head`, `nav`, `byline`, `meta` |
| `_layouts/` | `default`, `home`, `post`, `page` |
| `assets/style.css` | The single stylesheet |
| `assets/fonts/` | Self-hosted Roboto — **not** Google Fonts, on purpose |
| `specs/` | How this was designed and why |

## Local preview (optional — never needed to publish)

```bash
bundle install
bundle exec jekyll serve
```

## Rules this site is held to

In `specs/001-trail-journal-site/`. The short version: static, no JavaScript, readable
with CSS off, under 100 KB a page, publishable from a phone, and free to run forever.
