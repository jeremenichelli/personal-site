---
title: Blog
type: blog
layout: default
excerpt: These are some of the experiences, stories and articles on what I've learned during my journey as a web developer.
---

If you want me to write for your publication feel free [to send here](mailto:jmenichelli@gmail.com) the details.

<ul class="list">
{% for post in collections.blogposts %}
  <li class="list__item">
    <p class="list__item--info">
      <time datetime="{{ post.date | iso_date }}">
        {{ post.date | date: '%b %d, %Y'}}
      </time>
    </p>
    <a class="list__item--title" alt="{{ post.data.title }}" href="{{ post.url }}">
      {{ post.data.title | nbsp }}
    </a>
  {% if forloop.first %}
  <p class="list__item--excerpt">{{ post.data.excerpt }}</p>
  <a class="list--cta" href="{{ post.url }}">Read the article</a>
  {% endif %}
  </li>
{% endfor %}
</ul>

<a class="archive--link" href="/archive">See all articles</a>
