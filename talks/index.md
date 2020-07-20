---
title: Talks & workshops
layout: default
type: talks
excerpt: Events I spoke at about my ideas and thoughts on web development, performance, animation and design systems.
---

If you want me to speak at your event feel free to [send here](mailto:jmenichelli@gmail.com) the details.

<ul class="talks-list">
{% for talk in talks %}
  <li class="talks-list-item">
    <a
      aria-label="{{ talk.title }} at {{ talk.event }}"
      class="talks-list-item__title"
      alt="{{ talk.title }}"
      href="{{ talk.url }}" 
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ talk.title | nbsp }}
    </a>
    <p class="talks-list-item__info">{{ talk.date | date: '%b %d, %Y'}}
      <span class="talks-list-item__highlight">at {{ talk.event }}</span>
    </p>
  {% if forloop.first %}
  <p class="talks-list-item__excerpt">{{ talk.abstract }}</p>
  <a
    aria-label="Link to {{ talk.title }} at {{ talk.event }}"
    class="talks-list-item__cta"
    href="{{ talk.url }}"
    rel="noopener noreferrer"
    target="_blank"
  >
    Link to the talk
  </a>
  {% endif %}
  </li>
{% endfor %}
</ul>
