---
layout: page
title: "Where we are"
permalink: /map/
description: "Our progress on foot."
---

{%- assign live = false -%}
{%- for hike in site.hikes -%}{%- if hike.embed_url and hike.embed_url != "" -%}{%- assign live = true -%}{%- endif -%}{%- endfor -%}

{%- if live %}
{%- for hike in site.hikes %}
{%- if hike.embed_url and hike.embed_url != "" %}
<h2>{{ hike.name }}{% if hike.where %} <span class="quiet">— {{ hike.where }}</span>{% endif %}</h2>

<div class="map">
  <iframe src="{{ hike.embed_url }}" title="Our progress on {{ hike.name }}" loading="lazy"></iframe>
</div>

<p><a href="{{ hike.link_url }}">Open the {{ hike.name }} map in Google Maps</a> — if the map
above doesn't load, this link always will.</p>
{%- endif %}
{%- endfor %}
{%- else %}
<p>No maps up yet. They'll live here once we're walking.</p>
{%- endif %}
