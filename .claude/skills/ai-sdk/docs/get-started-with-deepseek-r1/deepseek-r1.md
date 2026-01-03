## DeepSeek R1

DeepSeek R1 is a series of advanced AI models designed to tackle complex reasoning tasks in science, coding, and mathematics. These models are optimized to "think before they answer," producing detailed internal chains of thought that aid in solving challenging problems.

The series includes two primary variants:

- **DeepSeek R1-Zero**: Trained exclusively with reinforcement learning (RL) without any supervised fine-tuning. It exhibits advanced reasoning capabilities but may struggle with readability and formatting.
- **DeepSeek R1**: Combines reinforcement learning with cold-start data and supervised fine-tuning to improve both reasoning performance and the readability of outputs.

### Benchmarks

DeepSeek R1 models excel in reasoning tasks, delivering competitive performance across key benchmarks:

- **AIME 2024 (Pass\@1)**: 79.8%
- **MATH-500 (Pass\@1)**: 97.3%
- **Codeforces (Percentile)**: Top 4% (96.3%)
- **GPQA Diamond (Pass\@1)**: 71.5%

[Source](https://github.com/deepseek-ai/DeepSeek-R1?tab=readme-ov-file#4-evaluation-results)

### Prompt Engineering for DeepSeek R1 Models

DeepSeek R1 models excel with structured and straightforward prompts. The following best practices can help achieve optimal performance:

1. **Use a structured format**: Leverage the model’s preferred output structure with `<think>` tags for reasoning and `<answer>` tags for the final result.
2. **Prefer zero-shot prompts**: Avoid few-shot prompting as it can degrade performance; instead, directly state the problem clearly.
3. **Specify output expectations**: Guide the model by defining desired formats, such as markdown for readability or XML-like tags for clarity.

