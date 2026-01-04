## Next Steps

Now that you have successfully set up Drizzle ORM with Xata, you can explore more advanced features:

- Learn about [Drizzle relations](/docs/rqb) for complex queries
- Explore [Xata's documentation](https://xata.io/documentation/)
- Implement [database migrations](/docs/migrations) for production deployments

Source: https://orm.drizzle.team/docs/tutorials/drizzle-nextjs-neon


import Steps from "@mdx/Steps.astro";
import Npm from "@mdx/Npm.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import CodeTab from "@mdx/CodeTab.astro";
import Section from "@mdx/Section.astro";
import Tabs from "@mdx/Tabs.astro";
import Tab from "@mdx/Tab.astro";
import Prerequisites from "@mdx/Prerequisites.astro";
import Callout from "@mdx/Callout.astro";

This tutorial demonstrates how to build `Todo app` using **Drizzle ORM** with **Neon database** and **Next.js**.

<Prerequisites>  
  - You should have an existing Next.js project or create a new one using the following command:
  ```bash
  npx create-next-app@latest --typescript
  ```

  - You should have installed Drizzle ORM and [Drizzle kit](/docs/kit-overview). You can do this by running the following command:
  <Npm>
    drizzle-orm 
    -D drizzle-kit
  </Npm>

  - You should have installed the [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver). 
  <Npm>
    @neondatabase/serverless
  </Npm>

  - You should have installed the `dotenv` package for managing environment variables. 
  <Npm>
    dotenv
  </Npm>  
</Prerequisites>

<Callout type="warning">
In case you face the issue with resolving dependencies during installation:

If you're not using React Native, forcing the installation with `--force` or `--legacy-peer-deps` should resolve the issue. If you are using React Native, then you need to use the exact version of React which is compatible with your React Native version.
</Callout>

