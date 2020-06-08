---
title: Blog
type: blog
layout: default
excerpt: These are some of the experiences, stories and articles on what I've learned during my journey as a web developer.
---

If you want me to write for your publication feel free [to send here](mailto:jmenichelli@gmail.com) the details.

<ul class="blog-list">
{% for post in collections.blogposts %}
  <li class="blog-list-item">
    <a class="blog-list-item__title" alt="{{ post.data.title }}" href="{{ post.url }}">
      {{ post.data.title | nbsp }}
    </a>
    <p class="blog-list-item__info">
      <time datetime="{{ post.date | iso_date }}">
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

