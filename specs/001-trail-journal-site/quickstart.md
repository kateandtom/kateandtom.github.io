# Quickstart: publishing to the walking journal

**Feature**: `001-trail-journal-site` | **Site**: https://kateandtom.github.io

Written for a phone, at a hut, on bad signal.

---

## Publish a post

1. Open **github.com/kateandtom/kateandtom.github.io** in the phone browser.
2. Go into `_posts` → the folder for the hike you're on (`wind-rivers`, `te-araroa`) →
   **Add file** → **Create new file**.
3. Name it `YYYY-MM-DD-short-slug.md` — today's date, then a few words, hyphens, **no
   macrons or spaces in the filename**.

   The folder is what says which hike it is. You don't write that anywhere.
4. Type this at the top, then the entry below it:

   ```
   ---
   title: "Down the Whanganui"
   ---

   Woke to rain on the roof...
   ```

5. **Commit changes** at the bottom.
6. Wait a couple of minutes. It's live at https://kateandtom.github.io.

That's the whole thing. Nothing else to edit — the journal list, the feed, and the archive
all update themselves.

### Who it says wrote it

| You want | You type |
|---|---|
| Both of you | *nothing* — leave `authors` out entirely |
| Just Kate | `authors: kate` |
| Just Tom | `authors: tom` |
| A guest, with Kate | `authors: [kate, sam]` |

Guests need one line added to `_data/authors.yml` first — `sam: Sam`.

### Starting a new hike

Once per hike, not per post. Two small edits to `_config.yml`:

```yaml
hikes:
  - name: "Wind River Range"      # add yours at the top — newest first
    where: "Wyoming, USA"
    embed_url: ""                 # from Google My Maps
    link_url: ""

defaults:
  - scope:
      path: "_posts/wind-rivers"  # the folder you'll put entries in
      type: "posts"
    values:
      trip: "Wind River Range"
```

Then just start creating posts in `_posts/wind-rivers/`. Nothing else — no new page, no
menu item, no layout.

### Saying where you were

Add a `place` line and it shows up under the date:

```
---
title: "Down the Whanganui"
place: "Whakahoro"
---
```

Free text — write whatever you'd say out loud. "Titcomb Basin", "a hut with no name",
"somewhere south of Boyle Village". Leave it out and the post just doesn't show a location.
No coordinates, ever.

It reads alongside the hike name: `Titcomb Basin, Wind River Range`.

### Drafting

Two different problems, two different answers.

**"Written, not ready to publish yet."** Add `published: false` under the title:

```
---
title: "A hard day"
published: false
---
```

It's off the journal, off the feed, and off the site entirely — the page isn't built at all.
Delete that one line when it's ready and it goes live at its normal URL.

**"I don't want anyone reading this yet."** Then don't commit it. Write it in the Journal or
Notes app on your phone and paste it into GitHub when you're happy with it.

This matters: `published: false` hides a post from *readers of the site*, not from *readers of
the repository*. The repo is public — it has to be, for free hosting — so a draft file sits
there in plain sight, and once committed it stays in the history even if you delete it later.
There is no committing something privately.

**One catch**: you can't preview a `published: false` post as a rendered page — it isn't
built. If you want to see it before anyone else does, either publish it and edit freely
afterwards (the URL never changes, so nothing breaks), or preview it on a laptop with
`bundle exec jekyll serve --unpublished`.

Honestly, publishing and then fixing is fine here. Nobody is watching the site at the moment
you commit, and a typo corrected ten minutes later is invisible.

---

## Add a photo

1. **Resize it first** — about 1600 px on the long edge. A straight-from-camera photo is
   3–5 MB and will make the page unusable on a trail connection.
2. In the repo, open `img/` → **Add file** → **Upload files** → pick the photo → commit.
3. In the post, write:

   ```
   ![Looking south from Waiau Pass](/img/waiau-pass.jpg)
   ```

   The text in brackets is what someone hears if they're using a screen reader, and what
   shows if the image fails to load. Write a real description, not "photo".

Honest warning: this is the clunkiest part of posting from a phone. Several taps, no
resizing built in. If signal is poor, post the words now and add photos in the next town.

---

## Update the map

Open **Google My Maps** on the phone, move or add a point, done. The site picks it up
automatically — nothing to commit.

Each hike has its own map, listed newest-first on the map page. A hike whose `embed_url` is
still blank just doesn't appear there yet.

### Linking a map pin to a post

Tap the pin in My Maps, edit its description, paste the post's URL in. Someone tapping that
spot on the map gets a route through to the entry you wrote there. All from the app, nothing
committed.

Worth testing once: whether the URL comes out tappable or as plain text you'd have to copy.
Google doesn't document it either way. Either is fine, but it's good to know which you're
giving people.

Going the other direction — a link *from* a post *to* a spot on the map — isn't automatic and
deliberately isn't built in; it would mean typing coordinates into every post. If one entry
really warrants it, paste a map link into the body by hand.

One-time setup, and easy to get wrong: the map must be shared **publicly** in My Maps
settings. If it isn't, it looks fine to you and shows an error to everyone else. Check it
from a logged-out browser once.

---

## Fixing a mistake

Editing a post: open the file, tap the pencil, change it, commit. The URL stays the same, so
links people have already shared keep working.

**If a post doesn't appear**, it's almost always the front matter. Check:

- Three dashes on their own line, above and below.
- `title:` has a space after the colon, and quotes around the title if it contains a colon.
- The filename starts with a valid `YYYY-MM-DD-`.
- You didn't leave `published: false` in there.

Dates ahead of today are fine — `future: true` is set in `_config.yml` precisely so that an
evening entry in New Zealand, which the UTC build server thinks is tomorrow, still shows up.
Don't remove that line.

To see the actual error: on the repo page, tap the tick or cross next to the latest commit.
A red cross means the build failed and will tell you which file and line.

---

## For whoever has a laptop

Local preview is optional — publishing never requires it.

```bash
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000. Needs a `Gemfile` containing `gem "github-pages", group:
:jekyll_plugins`, which pins the same versions GitHub builds with.

---

## Before launch — checklist

- [ ] Repo is **public** — Pages will not serve a private repo on the free plan
- [ ] Repo is named exactly `kateandtom.github.io`
- [ ] Settings → Pages → Source is **Deploy from a branch**, `main`, `/ (root)`
- [ ] Site loads over **https**
- [ ] Both walkers can commit with their own GitHub login
- [ ] `_data/authors.yml` has both names
- [ ] The current hike has a `hikes` entry, a `defaults` block, and a `_posts/` folder
- [ ] Each hike's map is shared publicly — verified from a logged-out browser
- [ ] A post URL pasted into a map pin description — checked how it renders
- [ ] A test post published, then deleted, from a phone
- [ ] Site read at 320 px wide with no sideways scrolling
- [ ] Feed at `/feed.xml` opens without an error
