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

# Features

## Type Fighter

A clicker-esque typing game. 

### Todos

* Now that core elements are in, look at DOM structure for entire game.
* Refactor any view updating code to better accomodate animations.
* Refactor scss so that styling classes are no longer ids. This should slim down `game.theme.css`
* Balancing - Letter is most powerful upgrades. Increasing line/word length is a penalty, not a buff. 

### New features

* Email from boss / random event: Modal / pop up notification. When click, chance at a random upgrade with flavour text.