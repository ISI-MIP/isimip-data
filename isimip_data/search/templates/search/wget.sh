#!/bin/bash
{% for file in dataset.files.all %}wget {{ file.url }}
{% endfor %}
