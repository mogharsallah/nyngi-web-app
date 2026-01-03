## OpenAI o3-mini

OpenAI recently released a new AI model optimized for STEM reasoning that excels in science, math, and coding tasks. o3-mini matches o1's performance in these domains while delivering faster responses and lower costs. The model supports tool calling, structured outputs, and system messages, making it a great option for a wide range of applications.

o3-mini offers three reasoning effort levels:

1. [**Low**]: Optimized for speed while maintaining solid reasoning capabilities
2. [**Medium**]: Balanced approach matching o1's performance levels
3. [**High**]: Enhanced reasoning power exceeding o1 in many STEM domains

| Model   | Streaming           | Tool Calling        | Structured Output   | Reasoning Effort    | Image Input         |
| ------- | ------------------- | ------------------- | ------------------- | ------------------- | ------------------- |
| o3-mini | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Cross size={18} /> |

### Benchmarks

OpenAI o3-mini demonstrates impressive performance across technical domains:

- 87.3% accuracy on AIME competition math questions
- 79.7% accuracy on PhD-level science questions (GPQA Diamond)
- 2130 Elo rating on competitive programming (Codeforces)
- 49.3% accuracy on verified software engineering tasks (SWE-bench)

<Note>These benchmark results are using high reasoning effort setting.</Note>

[Source](https://openai.com/index/openai-o3-mini/)

### Prompt Engineering for o3-mini

The o3-mini model performs best with straightforward prompts. Some prompt engineering techniques, like few-shot prompting or instructing the model to "think step by step," may not enhance performance and can sometimes hinder it. Here are some best practices:

1. Keep prompts simple and direct: The model excels at understanding and responding to brief, clear instructions without the need for extensive guidance.
2. Avoid chain-of-thought prompts: Since the model performs reasoning internally, prompting it to "think step by step" or "explain your reasoning" is unnecessary.
3. Use delimiters for clarity: Use delimiters like triple quotation marks, XML tags, or section titles to clearly indicate distinct parts of the input.

