# Learning Path (8-12 Weeks)

## Week 1-2: Agent and tool-calling basics

- Read `src/agents/single-agent.ts` end-to-end.
- Add 2 new tools in `src/tools/default-tools.ts`.
- Add one failure case and retry behavior in the agent loop.

## Week 3-5: RAG and memory

- Replace `HashEmbedder` with a provider-based embedder.
- Add metadata filters to retrieval in `src/rag/vector-store.ts`.
- Persist source docs and retrieval logs.

## Week 6-8: Multi-agent + reliability

- Add structured outputs (Zod schemas) for each agent role.
- Track latency and token/cost budgets per run.
- Add test cases for evaluator gates.

## Week 9-12: Production hardening

- Move long-running flows to queue/background jobs.
- Add an HTTP API and request-level tracing.
- Add CI checks (type-check, tests, lint) and quality budgets.

## Suggested portfolio increment

Build a "Decision Assistant" that:

- Ingests policy and incident docs
- Retrieves relevant context
- Calls internal tools (risk score, status lookup, policy checker)
- Produces a structured recommendation with assumptions and confidence
- Logs every step and fails safely
