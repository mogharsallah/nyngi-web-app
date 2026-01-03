## Project structure

The starter repository already includes everything that you will need, including:

- Database seed script (`lib/seed.ts`)
- Basic components built with shadcn/ui (`components/`)
- Function to run SQL queries (`app/actions.ts`)
- Type definitions for the database schema (`lib/types.ts`)

### Existing components

The application contains a single page in `app/page.tsx` that serves as the main interface.

At the top, you'll find a header (`header.tsx`) displaying the application title and description. Below that is an input field and search button (`search.tsx`) where you can enter natural language queries.

Initially, the page shows a collection of suggested example queries (`suggested-queries.tsx`) that you can click to quickly try out the functionality.

When you submit a query:

- The suggested queries section disappears and a loading state appears
- Once complete, a card appears with "TODO - IMPLEMENT ABOVE" (`query-viewer.tsx`) which will eventually show your generated SQL
- Below that is an empty results area with "No results found" (`results.tsx`)

After you implement the core functionality:

- The results section will display data in a table format
- A toggle button will allow switching between table and chart views
- The chart view will visualize your query results

Let's implement the AI-powered functionality to bring it all together.

