---
name: skill-format-comment-code
description: >-
  Requires a fixed-length file banner comment at the top of each file. After
  `/*` or `<!--`, the next 3 lines must each start with 4 spaces of indent.
  Use when creating or editing .astro, .js, .ts, or .html files, or when the
  user mentions file headers, banners, or skill-format-comment-code.
---

# Skill Format Comment Code

Banner comment required at the top of every new/edited source file.

## When to apply

- Creating or editing `.astro`, `.js`, `.ts`, or `.html` files
- User mentions file banners / headers or `skill-format-comment-code`

## Placement

| File type | Placement |
|-----------|-----------|
| `.astro` | Inside frontmatter, immediately after the opening `---` |
| `.js` / `.ts` | First lines of the file |
| `.html` / markup | First lines of the file (use `<!--` / `-->`) |

## Indentation (required)

After the opening `/*` or `<!--`, the **next 3 lines** must each start with exactly **4 spaces**, then the banner content. The closing `*/` or `-->` goes on its own line with **no** leading indent.

```text
/*
    {line 1}
    {line 2}
    {line 3}
*/
```

or:

```text
<!--
    {line 1}
    {line 2}
    {line 3}
-->
```

## Pattern

Three inner lines must have **exactly the same length** (counting from `*` to `*`; the shared 4-space indent does not change relative length).

Build the **middle line** first (after the 4-space indent):

```text
*  -----  {nombre-archivo}  --  {ruta-con-nombre}  -----  *
```

Rules for the middle line (verbatim spacing, **after** the 4-space indent):

1. `*`
2. 2 spaces
3. 5 dashes (`-----`)
4. 2 spaces
5. `nombre-archivo` (basename only, e.g. `BlogPost.astro`)
6. 2 spaces
7. 2 dashes (`--`)
8. 2 spaces
9. `ruta-con-nombre` from project root with leading `/` (e.g. `/src/layouts/BlogPost.astro`)
10. 2 spaces
11. 5 dashes (`-----`)
12. 2 spaces
13. `*`

Then build **top and bottom** lines with the **same total length** (also after the 4-space indent):

```text
*  {N dashes}  *
```

where `N = length(middle) - 6` (subtract leading `*  ` and trailing `  *`).

Wrap all three indented lines:

```text
/*
    {border}
    {middle}
    {border}
*/
```

## Examples

For `src/pages/blog/[...slug].astro`:

```astro
---
/*
    *  ------------------------------------------------------------------  *
    *  -----  [...slug].astro  --  /src/pages/blog/[...slug].astro  -----  *
    *  ------------------------------------------------------------------  *
*/
---
```

For `src/layouts/BlogPost.astro`:

```astro
---
/*
    *  -------------------------------------------------------------  *
    *  -----  BlogPost.astro  --  /src/layouts/BlogPost.astro  -----  *
    *  -------------------------------------------------------------  *
*/

import { Image } from "astro:assets";

// ...
---
```

For a `.js` / `.ts` file:

```js
/*
    *  --------------------------------------------------------------------------  *
    *  -----  nombre-archivo.js  --  /carpeta/subcarpeta/nombre-archivo.js  -----  *
    *  --------------------------------------------------------------------------  *
*/
```

For HTML-style comments:

```html
<!--
    *  -------------------------------------------------------------  *
    *  -----  BlogPost.astro  --  /src/layouts/BlogPost.astro  -----  *
    *  -------------------------------------------------------------  *
-->
```

## Checklist before finishing a file

- [ ] Banner present with correct filename and path
- [ ] Opens with `/*` or `<!--` on its own line
- [ ] All 3 inner lines start with exactly 4 spaces
- [ ] All 3 inner lines same length
- [ ] Middle line matches the spacing rules above
- [ ] Closes with `*/` or `-->` on its own line (no indent)
