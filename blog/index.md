---
title: Blog
type: blog
layout: default
excerpt: These are some of the experiences, stories and articles on what I've learned during my journey as a web engineer.
---

If you want me to write for your publication feel free [to send here](mailto:jmenichelli@gmail.com) the details.

<ul class="list">
{% for post in collections.blogposts %}
  <li class="list__item">
    <p class="list__item--info">
      {%- if post.data.external_url -%}
        Hosted by <span class="list__item--highlight">{{ post.data.host }}</span>
      {%- else -%}
      <time datetime="{{ post.date | iso_date }}">
        {{ post.date | date: '%b %d, %Y'}}
      </time>
    {%- endif -%}
    </p>
    <a class="list__item--title" alt="{{ post.data.title }}"
    {%- if post.data.external_url -%}
      href="{{ post.data.external_url }}" target="_blank" rel="noopener noreferrer"
    {%- else -%}
      href="{{ post.url }}"
    {%- endif -%}>
      {{ post.data.title }}
    </a>
  {% if forloop.first %}
  <p class="list__item--excerpt">{{ post.data.excerpt }}</p>
  <a class="list--cta"
  {%- if post.data.external_url -%}
    href="{{ post.data.external_url }}" target="_blank" rel="noopener noreferrer"
  {%- else -%}
    href="{{ post.url }}"
  {%- endif -%}
  >Read the article</a>
  {% endif %}
  </li>
{% endfor %}
  <li class="list__item">
    <a class="list--cta" href="/archive">See all articles</a>
  </li>
</ul>

