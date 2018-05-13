# github.js

Wrapper for Github API

## Getting Started

- install node.js
- run `npm install -g yarn` to install yarn
- run `yarn` to install dependencies
- run `yarn run build` to compile CoffeeScript
- run `yarn run test` for testing
- run `yarn run pull:gists` to pull all gists and generate Markdown files
- run `yarn run gist-sync` to pull all MD gists and copy to bndy.net and wiki.bndy.net repos. On WinOS use win-gist-sync instead. The both of repos MUST be in same parent folder with this repo.

### Usage

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js"></script>
<script src="https://cdn.rawgit.com/bndynet/github.js/master/dist/github.js"></script>
<script>
  github = Github('bndynet');
  github.getEvents(function(events) {
    // TODO
  });
</script>
```