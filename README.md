<div style="text-align: center">
    <img src="./tamahagane.svg" alt="Tamahagane Framework">
</div>

# Tamahagane Framework

Tamahagane is an opinionated framework for building static sites. It is built atop the [Metalsmith](https://metalsmith.io/) static site generator. The framework consists of some practical code i.e. plugins as well as process and methodology. 

__NOTE__
These plugins are only designed to work within the Tamahagane framework, though they may work fine outside
with just standard Metalsmith they make some assumptions including that you are using [handlebars](https://handlebarsjs.com/) for templates.  

# Plugins

The Framework uses many plugins some developed especially for Tamahagane and some Third Party.

## Tamahagane Plugins
### Base
1. Handlebar Tools - Allows you to load Partials and Helpers so views have access
2. Handlebar Content - Allows you to use partials in content pages
3. Gallery - Allows the embedding of a gallery by scanning a folder
4. Draft Excluder - Stops draft posts from been published
5. Meta Loader - Loads in global metadata in a connivent easy to use way. 
6. Includes - Allows the including of a page and all its data in another page
7. Inherit - Inherit meta data from another page
8. Is Current - Find the current page
9. List - Allows the listing of pages in another page
10. Image Manger - Helps when embedding images

### Optional

These optional plugins allow you to add extra functionality

11. Image Colors - find the dominant colors in your images
12. Storybook Renderer - Build a storybook out of your handlebar partials
13. Meta Data Debugger - Debug issues with meta data
14. Countdown - Add a counter to your site

# Installing 

You can install plugins individually click on a plugin to go to its readme to see how.

## Bundles
There are also packages for 'Base' , 'Optional' and 'All'

Installs all the plugins under the base heading above.

Install with

```base
npm i @dotmh/tamahagane-<BUNDLE>
```

i.e.

```bash
npm i @dotmh/tamahagane-base 
```

You can then use them by including the individual plugins from the bundle, for example for `tamahagane-base`

```javascript
const {handlebars-content} = require('@dotmh/tamahagane-base');

```