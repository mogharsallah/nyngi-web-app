## OpenAI o1

OpenAI released a series of AI models designed to spend more time thinking before responding. They can reason through complex tasks and solve harder problems than previous models in science, coding, and math. These models, named the o1 series, are trained with reinforcement learning and can "think before they answer". As a result, they are able to produce a long internal chain of thought before responding to a prompt.

The main reasoning model available in the API is:

1. [**o1**](https://platform.openai.com/docs/models#o1): Designed to reason about hard problems using broad general knowledge about the world.

| Model | Streaming           | Tools               | Object Generation   | Reasoning Effort    |
| ----- | ------------------- | ------------------- | ------------------- | ------------------- |
| o1    | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |

### Benchmarks

OpenAI o1 models excel in scientific reasoning, with impressive performance across various domains:

- Ranking in the 89th percentile on competitive programming questions (Codeforces)
- Placing among the top 500 students in the US in a qualifier for the USA Math Olympiad (AIME)
- Exceeding human PhD-level accuracy on a benchmark of physics, biology, and chemistry problems (GPQA)

[Source](https://openai.com/index/learning-to-reason-with-llms/)

### Prompt Engineering for o1 Models

The o1 models perform best with straightforward prompts. Some prompt engineering techniques, like few-shot prompting or instructing the model to "think step by step," may not enhance performance and can sometimes hinder it. Here are some best practices:

1. Keep prompts simple and direct: The models excel at understanding and responding to brief, clear instructions without the need for extensive guidance.
2. Avoid chain-of-thought prompts: Since these models perform reasoning internally, prompting them to "think step by step" or "explain your reasoning" is unnecessary.
3. Use delimiters for clarity: Use delimiters like triple quotation marks, XML tags, or section titles to clearly indicate distinct parts of the input, helping the model interpret different sections appropriately.
4. Limit additional context in retrieval-augmented generation (RAG): When providing additional context or documents, include only the most relevant information to prevent the model from overcomplicating its response.

