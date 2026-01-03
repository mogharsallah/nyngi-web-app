## DeepSeek V3.2

DeepSeek V3.2 is a frontier model that harmonizes high computational efficiency with superior reasoning and agent performance. It introduces several key technical breakthroughs that enable it to perform comparably to GPT-5 while remaining open-source.

The series includes two primary variants:

- **DeepSeek V3.2**: The official successor to V3.2-Exp. A balanced model optimized for both reasoning and inference efficiency, delivering GPT-5 level performance.
- **DeepSeek V3.2-Speciale**: A high-compute variant with maxed-out reasoning capabilities that rivals Gemini-3.0-Pro. Achieves gold-medal performance in IMO 2025, CMO 2025, ICPC World Finals 2025, and IOI 2025. As of release, it does not support tool-use.

### Benchmarks

DeepSeek V3.2 models excel in both reasoning and agentic tasks, delivering competitive performance across key benchmarks:

**Reasoning Capabilities**

- **AIME 2025 (Pass@1)**: 96.0% (Speciale)
- **HMMT 2025 (Pass@1)**: 99.2% (Speciale)
- **HLE (Pass@1)**: 30.6%
- **Codeforces (Rating)**: 2701 (Speciale)

**Agentic Capabilities**

- **SWE Verified (Resolved)**: 73.1%
- **Terminal Bench 2.0 (Acc)**: 46.4%
- **τ2 Bench (Pass@1)**: 80.3%
- **Tool Decathlon (Pass@1)**: 35.2%

[Source](https://huggingface.co/deepseek-ai/DeepSeek-V3.2/resolve/main/assets/paper.pdf)

### Model Options

When using DeepSeek V3.2 with the AI SDK, you have two model options:

| Model Alias         | Model Version                     | Description                                    |
| ------------------- | --------------------------------- | ---------------------------------------------- |
| `deepseek-chat`     | DeepSeek-V3.2 (Non-thinking Mode) | Standard chat model                            |
| `deepseek-reasoner` | DeepSeek-V3.2 (Thinking Mode)     | Enhanced reasoning for complex problem-solving |

