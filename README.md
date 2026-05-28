# Sensei

A silent coding teacher for VS Code.

Sensei watches you code, knows your intent, and whispers only when you're going off track.
Not a chatbot. Not autocomplete. A teacher.

## How it works

1. Tell Sensei what you're building (one line)
2. Code freely
3. Sensei stays silent unless you drift from your intent
4. When you do — one subtle hint, no solution given

## Requirements

- [Ollama](https://ollama.com) installed and running locally
- VS Code 1.85+

## Setup

1. Install extension
2. Make sure Ollama is running (`ollama serve`)
3. Sensei will guide you through model download on first launch

## Model Tiers

| Tier    | Model              | RAM   |
| ------- | ------------------ | ----- |
| Minimum | qwen2.5-coder:0.5b | ≤4GB  |
| Average | qwen2.5-coder:1.5b | 4-8GB |
| Good    | qwen2.5-coder:3b   | 8GB+  |

## Commands

- `Sensei: Set Intent` — tell Sensei what you're building
- `Sensei: Reset Session` — clear current session

## Philosophy

Sensei believes you learn by doing, not by being told the answer.
It will never write code for you. It will never solve your bug.
It will only ask you to think harder in the right direction.

## License

Apache 2.0
