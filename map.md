---
layout: page
title: "Where we are"
permalink: /map/
description: "Our Te Araroa route and journal entries."
---

## Te Araroa

A simplified view of our route through Aotearoa New Zealand. Select a marker to read the journal entry from that place. The line is an overview, not a navigation map.

<link rel="stylesheet" href="{{ '/assets/trail/trail.css' | relative_url }}?v={{ site.time | date: '%s' }}">

{% include trail-map.html journal=true %}

<p class="trail-note">Route adapted from the <a href="https://www.teararoa.org.nz/notes-and-maps/">Te Araroa Trust’s 2026–27 GPS data</a> (<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>); coastline from <a href="https://www.naturalearthdata.com/about/terms-of-use/">Natural Earth</a>.</p>

{% assign mapped_count = 0 %}
{% for post in site.posts %}
  {% if post.trip == 'Te Araroa' and post.latitude and post.longitude %}
    {% assign lat = post.latitude | plus: 0 %}{% assign lon = post.longitude | plus: 0 %}
    {% if lat >= -47.0 and lat <= -34.0 and lon >= 166.0 and lon <= 178.9 %}{% assign mapped_count = mapped_count | plus: 1 %}{% endif %}
  {% endif %}
{% endfor %}

{% if mapped_count == 0 %}
No entries have a map location yet. We’ll add them as we go.
{% else %}
### Entries on the map
{% for post in site.posts %}
  {% if post.trip == 'Te Araroa' and post.latitude and post.longitude %}
    {% assign lat = post.latitude | plus: 0 %}{% assign lon = post.longitude | plus: 0 %}
    {% if lat >= -47.0 and lat <= -34.0 and lon >= 166.0 and lon <= 178.9 %}
<p><a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>{% if post.place %} — {{ post.place | escape }}{% endif %} · {{ post.date | date: '%-d %B %Y' }}</p>
    {% endif %}
  {% endif %}
{% endfor %}
{% endif %}

### Other Te Araroa entries
{% assign other_count = 0 %}
{% for post in site.posts %}
  {% if post.trip == 'Te Araroa' %}
    {% assign is_mapped = false %}
    {% if post.latitude and post.longitude %}
      {% assign lat = post.latitude | plus: 0 %}{% assign lon = post.longitude | plus: 0 %}
      {% if lat >= -47.0 and lat <= -34.0 and lon >= 166.0 and lon <= 178.9 %}{% assign is_mapped = true %}{% endif %}
    {% endif %}
    {% unless is_mapped %}
      {% assign other_count = other_count | plus: 1 %}
<p><a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a> · {{ post.date | date: '%-d %B %Y' }}</p>
    {% endunless %}
  {% endif %}
{% endfor %}
{% if other_count == 0 %}<p>None yet.</p>{% endif %}

{% for hike in site.hikes %}
  {% if hike.name != 'Te Araroa' and hike.embed_url and hike.embed_url != '' %}
<h2>{{ hike.name | escape }}</h2>
<div class="map"><iframe src="{{ hike.embed_url | escape }}" title="Our progress on {{ hike.name | escape }}" loading="lazy"></iframe></div>
<p><a href="{{ hike.link_url | escape }}">Open the {{ hike.name | escape }} map</a></p>
  {% endif %}
{% endfor %}
