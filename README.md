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

1. Read /content directory & subdirectories.
2. Replicate folder structure in /out directory.
3. Read .scss files in /scss directory.
4. Find all scss files in the format {name}.theme.scss
