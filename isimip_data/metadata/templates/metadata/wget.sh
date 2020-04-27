#!/bin/bash
{% for file in files %}wget {{ file.file_url }}
{% endfor %}