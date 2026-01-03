## Project Setup

In this project, you will build a agent that will only respond with information that it has within its knowledge base. The agent will be able to both store and retrieve information. This project has many interesting use cases from customer support through to building your own second brain!

This project will use the following stack:

- [Next.js](https://nextjs.org) 14 (App Router)
- [ AI SDK ](/docs)
- [ Vercel AI Gateway ](/providers/ai-sdk-providers/ai-gateway)
- [ Drizzle ORM ](https://orm.drizzle.team)
- [ Postgres ](https://www.postgresql.org/) with [ pgvector ](https://github.com/pgvector/pgvector)
- [ shadcn-ui ](https://ui.shadcn.com) and [ TailwindCSS ](https://tailwindcss.com) for styling

### Clone Repo

To reduce the scope of this guide, you will be starting with a [repository](https://github.com/vercel/ai-sdk-rag-starter) that already has a few things set up for you:

- Drizzle ORM (`lib/db`) including an initial migration and a script to migrate (`db:migrate`)
- a basic schema for the `resources` table (this will be for source material)
- a Server Action for creating a `resource`

To get started, clone the starter repository with the following command:

<Snippet
  text={[
    'git clone https://github.com/vercel/ai-sdk-rag-starter',
    'cd ai-sdk-rag-starter',
  ]}
/>

First things first, run the following command to install the project’s dependencies:

<Snippet text="pnpm install" />

### Create Database

You will need a Postgres database to complete this tutorial. If you don't have Postgres setup on your local machine you can:

- Create a free Postgres database with Vercel (recommended - see instructions below); or
- Follow [this guide](https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database) to set it up locally

#### Setting up Postgres with Vercel

To set up a Postgres instance on your Vercel account:

1. Go to [Vercel.com](https://vercel.com) and make sure you're logged in
1. Navigate to your team homepage
1. Click on the **Integrations** tab
1. Click **Browse Marketplace**
1. Look for the **Storage** option in the sidebar
1. Select the **Neon** option (recommended, but any other PostgreSQL database provider should work)
1. Click **Install**, then click **Install** again in the top right corner
1. On the "Get Started with Neon" page, click **Create Database** on the right
1. Select your region (e.g., Washington, D.C., U.S. East)
1. Turn off **Auth**
1. Click **Continue**
1. Name your database (you can use the default name or rename it to something like "RagTutorial")
1. Click **Create** in the bottom right corner
1. After seeing "Database created successfully", click **Done**
1. You'll be redirected to your database instance
1. In the Quick Start section, click **Show secrets**
1. Copy the full `DATABASE_URL` environment variable

### Migrate Database

Once you have a Postgres database, you need to add the connection string as an environment secret.

Make a copy of the `.env.example` file and rename it to `.env`.

<Snippet text="cp .env.example .env" />

Open the new `.env` file. You should see an item called `DATABASE_URL`. Copy in your database connection string after the equals sign.

With that set up, you can now run your first database migration. Run the following command:

<Snippet text="pnpm db:migrate" />

This will first add the `pgvector` extension to your database. Then it will create a new table for your `resources` schema that is defined in `lib/db/schema/resources.ts`. This schema has four columns: `id`, `content`, `createdAt`, and `updatedAt`.

<Note>
  If you experience an error with the migration, see the [troubleshooting
  section](#troubleshooting-migration-error) below.
</Note>

### Vercel AI Gateway Key

For this guide, you will need a Vercel AI Gateway API key, which gives you access to hundreds of models from different providers with one API key. If you haven't obtained your Vercel AI Gateway API key, you can do so by [signing up](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai&title=Go+to+AI+Gateway) on the Vercel website.

<Note>
  The AI SDK's Vercel AI Gateway Provider is the default global provider, so you
  can access models using a simple string in the model configuration. If you
  prefer to use a specific provider like OpenAI directly, see the [provider
  management](/docs/ai-sdk-core/provider-management) documentation.
</Note>

Now, open your `.env` file and add your API Gateway key:

```env filename=".env"
AI_GATEWAY_API_KEY=your-api-key
```

Replace `your-api-key` with your actual Vercel AI Gateway API key.

