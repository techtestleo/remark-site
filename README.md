# Blog

A static html blog powered by unififed & sass.

## Installation

0. Install `hello-world-nginx` container
1. git clone this repo
2. npm install
3. npm run build
4. Set /website_files volume in nginx container to /site/out
5. npm run watch
6. Start nginx container
7. Refresh page to see updates

# notes for v2 approach

## Goals

## Input

- /content directory with .MD files
- JSON / static ref to category & page themes
- website metadata

YAML style header for frontmatter:

```yaml
---
title: Foobar goes to Hollywood
category: story
date: "2016-08-05 09:44:16"
tags:
  - america
  - music
  - technology
---
```

## Output

Static HTML blog:

/index.html
  --/{category-a}/index.html
    --/{title}
    --/{title}
  --/{category-b}//index.html
    --/{title}
    --/{title}