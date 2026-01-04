# Drizzle Seed

<IsSupportedChipGroup chips={{ 'PostgreSQL': true, 'SQLite': true, 'MySQL': true, 'SingleStore': true, 'CockroachDB': true, 'MS SQL': true }} />

<Callout type='warning'>
  `drizzle-seed` can only be used with `drizzle-orm@0.36.4` or higher. Versions lower than this may work at runtime but could have type issues and identity column issues, as this patch was introduced in `drizzle-orm@0.36.4`
</Callout>

`drizzle-seed` is a TypeScript library that helps you generate deterministic, yet realistic,
fake data to populate your database. By leveraging a seedable pseudorandom number generator (pRNG),
it ensures that the data you generate is consistent and reproducible across different runs.
This is especially useful for testing, development, and debugging purposes.

#### What is Deterministic Data Generation?

Deterministic data generation means that the same input will always produce the same output.
In the context of `drizzle-seed`, when you initialize the library with the same seed number,
it will generate the same sequence of fake data every time. This allows for predictable and repeatable data sets.

#### Pseudorandom Number Generator (pRNG)

A pseudorandom number generator is an algorithm that produces a sequence of numbers
that approximates the properties of random numbers. However, because it's based on an initial value
called a seed, you can control its randomness. By using the same seed, the pRNG will produce the
same sequence of numbers, making your data generation process reproducible.

#### Benefits of Using a pRNG:

- Consistency: Ensures that your tests run on the same data every time.
- Debugging: Makes it easier to reproduce and fix bugs by providing a consistent data set.
- Collaboration: Team members can share seed numbers to work with the same data sets.

With drizzle-seed, you get the best of both worlds: the ability to generate realistic fake data and the control to reproduce it whenever needed.

