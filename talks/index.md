---
title: Talks & workshops
layout: default
type: talks
excerpt: I am open for speaking requests around general web development, performance, developer experience, animation and design systems.
---

If you want me to speak at your event feel free [to send here](mailto:jmenichelli@gmail.com) the details.

<ul class="list">
{% for talk in talks %}
  <li class="list__item">
    <p class="list__item--info">{{ talk.date | date: '%b %d, %Y'}}
    <span class="list__item--highlight">{{ talk.event }}</span></p>
    <a
      class="list__item--title"
      alt="{{ talk.title }}"
      href="{{ talk.url }}" 
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ talk.title }}
    </a>
    {%- if forloop.first -%}
    <p class="list__item--excerpt">{{talk.abstract}}</p>
    <a class="list--cta" href="{{ talk.url }}">Link to the event</a>
    {%- endif -%}
  </li>
{% endfor %}
</ul>
