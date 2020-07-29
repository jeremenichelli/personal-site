---
title: Blog
type: blog
layout: default
excerpt: A small part of my thoughts, experiences and stories as a web developer, turned into articles.
---

If you want me to write for your publication feel free to [send here](mailto:jmenichelli@gmail.com) the details.

<ul class="blog-list">
{% for post in collections.blog %}
  <li class="blog-list-item">
    <a class="blog-list-item__title" href="{{ post.url }}">
      {{ post.data.title | nbsp }}
    </a>
    <p class="blog-list-item__info">
      <time datetime="{{ post.date | 'date_to_xmlschema' }}">
        {{ post.date | date: '%b %d, %Y'}}
      </time>
    </p>
  {% if forloop.first %}
  <p class="blog-list-item__excerpt">{{ post.data.excerpt }}</p>
  <a class="blog-list-item__cta" href="{{ post.url }}">Read the article</a>
  {% endif %}
  </li>
{% endfor %}
</ul>

<p class="blog-links">
  <a class="blog-links__archive" href="/archive">See all articles</a>
</p>
