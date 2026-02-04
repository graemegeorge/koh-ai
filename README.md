# koh-ai 🤖⚙️

Welcome to your **AI Software Engineer Playground** — a hands-on repo to learn how agentic systems actually work in code (not just prompts).

## 🚀 What this project does

This repo simulates a realistic LLM application stack:

- **Goal-driven agent loop**: takes a goal, decides next actions, calls tools, and iterates
- **Tool calling**: validates structured tool inputs and executes API-like functions
- **RAG pipeline**: ingests docs, chunks text, creates embeddings, retrieves relevant context
- **Memory layer**: stores short-term session memory + long-term file-backed memory
- **Multi-agent workflow**: planner → executor → critic collaboration pattern
- **Quality checks**: evaluates responses for production-style guardrails

Think of it as a mini lab for:
`goal → plan → actions → evaluate → improve`

## 🧠 Architecture Tour

- `src/agents/single-agent.ts` — autonomous tool-calling loop with retry budget
- `src/agents/multi-agent.ts` — planner/executor/critic pattern
- `src/tools/default-tools.ts` — typed tools with Zod validation
- `src/rag/*` — chunking + embeddings + vector search
- `src/memory/memory.ts` — in-memory + persisted memory records
- `src/evals/evaluator.ts` — baseline answer quality gates
- `src/workflows/business-advisor.ts` — end-to-end scenario wiring everything together
- `src/index.ts` — scenario runner/entrypoint

## 🛠️ Quick Start

1. Install dependencies

```bash
npm install
```

2. Run playground scenarios

```bash
npm run scenario:agent
npm run scenario:rag
npm run scenario:multi
npm run scenario:workflow
```

3. Run type checks

```bash
npm run check
```

## 🎯 Scenario Guide

- `scenario:agent` — watch tool-calling and iterative decision flow
- `scenario:rag` — test retrieval behavior with embedded docs
- `scenario:multi` — inspect planner/executor/critic outputs
- `scenario:workflow` — full mini "production" flow with memory + eval

## 📚 Learning Path

Follow `docs/learning-path.md` for an 8–12 week progression from basics to production hardening.

## ✨ Why this is useful

This repo helps you practice the real role:

- less “chat with AI”
- more “engineer reliable AI systems under constraints”

You can now extend this like a real codebase: add providers, tests, observability, APIs, queues, and deployment workflows.
