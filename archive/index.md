---
title: Archive
layout: default
type: archive
---

<ul class="archive">
{% for post in collections.archive %}
  {% assign postCurrentDate = post.date | date: "%Y" %}
  {% if postCurrentDate != date %}
  <h2 class="archive__year">{{ postCurrentDate }}</h2>
  {% assign date = postCurrentDate %} 
  {% endif %}
  <li class="archive__item">
  <a class="archive__item--title" alt="{{ post.data.title }}"
  {%- if post.data.external_url -%}
    href="{{ post.data.external_url }}" target="_blank" rel="noopener noreferrer"
  {%- else -%}
    href="{{ post.url }}"
  {%- endif -%}>
    {{ post.data.title | nbsp }}
  </a>
  </li>
{% endfor %}
</ul>
