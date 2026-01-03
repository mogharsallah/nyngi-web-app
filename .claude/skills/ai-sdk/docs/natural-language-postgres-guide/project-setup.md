## Project setup

This project uses the following stack:

- [Next.js](https://nextjs.org) (App Router)
- [AI SDK](/docs)
- [OpenAI](https://openai.com)
- [Zod](https://zod.dev)
- [Postgres](https://www.postgresql.org/) with [ Vercel Postgres ](https://vercel.com/postgres)
- [shadcn-ui](https://ui.shadcn.com) and [TailwindCSS](https://tailwindcss.com) for styling
- [Recharts](https://recharts.org) for data visualization

### Clone repo

To focus on the AI-powered functionality rather than project setup and configuration we've prepared a starter repository which includes a database schema and a few components.

Clone the starter repository and check out the `starter` branch:

<Snippet
  text={[
    'git clone https://github.com/vercel-labs/natural-language-postgres',
    'cd natural-language-postgres',
    'git checkout starter',
  ]}
/>

### Project setup and data

Let's set up the project and seed the database with the dataset:

1. Install dependencies:

<Snippet text={['pnpm install']} />

2. Copy the example environment variables file:

<Snippet text={['cp .env.example .env']} />

3. Add your environment variables to `.env`:

```bash filename=".env"
OPENAI_API_KEY="your_api_key_here"
POSTGRES_URL="..."
POSTGRES_PRISMA_URL="..."
POSTGRES_URL_NO_SSL="..."
POSTGRES_URL_NON_POOLING="..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

4. This project uses CB Insights' Unicorn Companies dataset. You can download the dataset by following these instructions:
   - Navigate to [CB Insights Unicorn Companies](https://www.cbinsights.com/research-unicorn-companies)
   - Enter in your email. You will receive a link to download the dataset.
   - Save it as `unicorns.csv` in your project root

<Note>
  You will need a Postgres database to complete this tutorial. If you don't have
  Postgres setup on your local machine you can: - Create a free Postgres
  database with Vercel (recommended - see instructions below); or - Follow [this
  guide](https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database)
  to set it up locally
</Note>

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
1. Name your database (you can use the default name or rename it to something like "NaturalLanguagePostgres")
1. Click **Create** in the bottom right corner
1. After seeing "Database created successfully", click **Done**
1. You'll be redirected to your database instance
1. In the Quick Start section, click **Show secrets**
1. Copy the full `DATABASE_URL` environment variable and use it to populate the Postgres environment variables in your `.env` file

### About the dataset

The Unicorn List dataset contains the following information about unicorn startups (companies with a valuation above $1bn):

- Company name
- Valuation
- Date joined (unicorn status)
- Country
- City
- Industry
- Select investors

This dataset contains over 1000 rows of data over 7 columns, giving us plenty of structured data to analyze. This makes it perfect for exploring various SQL queries that can reveal interesting insights about the unicorn startup ecosystem.

5. Now that you have the dataset downloaded and added to your project, you can initialize the database with the following command:

<Snippet text={['pnpm run seed']} />

Note: this step can take a little while. You should see a message indicating the Unicorns table has been created and then that the database has been seeded successfully.

<Note>
  Remember, the dataset should be named `unicorns.csv` and located in root of
  your project.
</Note>

6. Start the development server:

<Snippet text={['pnpm run dev']} />

Your application should now be running at [http://localhost:3000](http://localhost:3000).

