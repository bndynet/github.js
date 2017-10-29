# github.js

Wrapper for Github Api

## Getting Started

- install node.js
- run `npm install -g yarn` to install yarn
- run `yarn` to install dependencies
- run `yarn run build` to compile CoffeeScript
- run `yarn run test` for testing
- run `yarn run sync:gists` to pull all gists and generate Markdown files

### Usage

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js"></script>
<script src="https://cdn.rawgit.com/bndynet/github.js/master/dist/github.js"></script>
<script>
  github.getEvents(function(events) {
    // TODO
  });
</script>
```


**IMPORTANT**

Maybe you need to change the user to your github username for your service.
