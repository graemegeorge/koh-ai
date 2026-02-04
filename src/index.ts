import { PlannerExecutorCritic } from "./agents/multi-agent.js";
import { loadConfig } from "./config/env.js";
import { Logger } from "./config/logger.js";
import { evaluateAnswer } from "./evals/evaluator.js";
import { MockLlmClient } from "./llm/mock-client.js";
import { HashEmbedder } from "./rag/embeddings.js";
import { RagService } from "./rag/rag-service.js";
import { InMemoryVectorStore } from "./rag/vector-store.js";
import { createDefaultToolRegistry } from "./tools/default-tools.js";
import { ToolCallingAgent } from "./agents/single-agent.js";
import { runBusinessAdvisorWorkflow } from "./workflows/business-advisor.js";

async function main() {
  const config = loadConfig();
  const logger = new Logger(config);
  const mode = process.argv[2] ?? "agent";

  if (mode === "agent") {
    const agent = new ToolCallingAgent(new MockLlmClient(), createDefaultToolRegistry(), logger);
    const result = await agent.run("We had an incident, please assess severity and recommend next steps.");
    console.log(JSON.stringify({ mode, result, evaluation: evaluateAnswer(result.answer) }, null, 2));
    return;
  }

  if (mode === "rag") {
    const rag = new RagService(new HashEmbedder(), new InMemoryVectorStore());
    await rag.ingestDocument(
      "doc-1",
      "This platform has strict usage limits and retry rules for webhooks.",
      { source: "demo" },
    );
    const results = await rag.retrieve("What are usage limits?");
    console.log(JSON.stringify({ mode, results }, null, 2));
    return;
  }

  if (mode === "multi") {
    const multi = new PlannerExecutorCritic(new MockLlmClient());
    const result = await multi.run("Plan and review a customer success incident report workflow.");
    console.log(JSON.stringify({ mode, result }, null, 2));
    return;
  }

  if (mode === "workflow") {
    const result = await runBusinessAdvisorWorkflow(logger);
    console.log(JSON.stringify({ mode, result }, null, 2));
    return;
  }

  console.log(`Unknown mode: ${mode}`);
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
