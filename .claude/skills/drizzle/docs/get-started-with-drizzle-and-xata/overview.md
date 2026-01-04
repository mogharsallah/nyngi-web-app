# Get Started with Drizzle and Xata

<Prerequisites>
  - **dotenv** - package for managing environment variables - [read here](https://www.npmjs.com/package/dotenv)
  - **tsx** - package for running TypeScript files - [read here](https://tsx.is/)
  - **Xata Postgres database** - [read here](https://xata.io/documentation)
</Prerequisites>

<FileStructure/>

#### Step 1 - Install **postgres** package
<InstallPackages lib='postgres'/>

#### Step 2 - Setup connection variables

<SetupEnv env_variable='DATABASE_URL' />

You can obtain a connection string by following the [Xata documentation](https://xata.io/documentation/getting-started).

#### Step 3 - Connect Drizzle ORM to the database

<ConnectXata/>

#### Step 4 - Create a table

<CreateTable />

#### Step 5 - Setup Drizzle config file

<SetupConfig dialect='postgresql' env_variable='DATABASE_URL'/>

#### Step 6 - Applying changes to the database

<ApplyChanges />

#### Step 7 - Seed and Query the database

<QueryDatabase dialect='postgres-js' env_variable='DATABASE_URL'/>

#### Step 8 - Run index.ts file

<RunFile/>

Source: https://orm.drizzle.team/docs/goodies


import Tab from '@mdx/Tab.astro';
import Tabs from '@mdx/Tabs.astro';
import Callout from '@mdx/Callout.astro';
import Section from '@mdx/Section.astro';
import CodeTabs from '@mdx/CodeTabs.astro';

