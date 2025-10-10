---
title: "{{ replace .Name "-" " " | title }}"
description: "Brief description of the page (40-60 characters recommended)"
icon: "article"
date: "{{ .Date }}"
lastmod: "{{ .Date }}"
draft: true
toc: true
# order: 0                      # Optional: Manual ordering override
#                                 Positive (1, 2, 3...) = first, second, third in list
#                                 0 or unset = default alphabetical order
#                                 Negative (-1, -2, -3...) = last, second to last, third to last
---