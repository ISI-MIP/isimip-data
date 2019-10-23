#!/bin/bash
{% for file in files %}wget {{ file.url }}
{% endfor %}