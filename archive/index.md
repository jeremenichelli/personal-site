---
title: Archive
excerpt: Everything I've written and dared to make public, since the beginning of time. Scroll and read at your own peril.
layout: default
type: archive
---

{% for post in collections.archive %}
  {% assign postYear = post.date | date: "%Y" %}

  {% if postYear != year %}

  <!--
    When it is not the first post and year have changed
    closed leading <ul> element
  -->
  {% if forloop.first != null %}
  </ul>
  {% endif %}

  <!--
    Print the year title and open a new list
  -->
  <h2 class="archive__year">{{ postYear }}</h2>
  <ul class="archive-list">

  <!--
    Cache new year value
  -->
  {% assign year = postYear %}
  {% endif %}
  
  <li class="archive-list-item">
  <a class="archive-list-item__link" href="{{ post.url }}">
    {{ post.data.title | nbsp }}
  </a>
  </li>

{% endfor %}
