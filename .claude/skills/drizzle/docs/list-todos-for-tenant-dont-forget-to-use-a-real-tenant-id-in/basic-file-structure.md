## Basic file structure

This guide uses the following file structure:

```text
📦 <project root>
 ├ 📂 migrations
 │  ├ 📂 meta
 │  └ 📜 0000_heavy_doctor_doom.sql
 ├ 📂 public
 ├ 📂 src
 │  ├ 📂 actions
 │  │  └ 📜 todoActions.ts
 │  ├ 📂 app
 │  │  ├ 📜 favicon.ico
 │  │  ├ 📜 globals.css
 │  │  ├ 📜 layout.tsx
 │  │  └ 📜 page.tsx
 │  ├ 📂 components
 │  │  ├ 📜 addTodo.tsx
 │  │  ├ 📜 todo.tsx
 │  │  └ 📜 todos.tsx
 │  └ 📂 db
 │  │  ├ 📜 drizzle.ts
 │  │  └ 📜 schema.ts
 │  └ 📂 types
 │     └ 📜 todoType.ts
 ├ 📜 .env
 ├ 📜 .eslintrc.json
 ├ 📜 .gitignore
 ├ 📜 drizzle.config.ts
 ├ 📜 next-env.d.ts
 ├ 📜 next.config.mjs
 ├ 📜 package-lock.json
 ├ 📜 package.json
 ├ 📜 postcss.config.mjs
 ├ 📜 README.md
 ├ 📜 tailwind.config.ts
 └ 📜 tsconfig.json
```


Source: https://orm.drizzle.team/docs/typebox

import Npm from '@mdx/Npm.astro';
import Callout from '@mdx/Callout.astro';

