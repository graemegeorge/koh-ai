import type { Logger } from "../config/logger.js";
import { evaluateAnswer } from "../evals/evaluator.js";
import { MockLlmClient } from "../llm/mock-client.js";
import { FileMemory, SessionMemory } from "../memory/memory.js";
import { HashEmbedder } from "../rag/embeddings.js";
import { RagService } from "../rag/rag-service.js";
import { InMemoryVectorStore } from "../rag/vector-store.js";
import { createDefaultToolRegistry } from "../tools/default-tools.js";
import { ToolCallingAgent } from "../agents/single-agent.js";

export async function runBusinessAdvisorWorkflow(logger: Logger) {
  const llm = new MockLlmClient();
  const tools = createDefaultToolRegistry();

  const sessionMemory = new SessionMemory();
  const fileMemory = new FileMemory("./data/memory.json");

  const rag = new RagService(new HashEmbedder(), new InMemoryVectorStore());
  await rag.ingestDocument(
    "support-handbook",
    [
      "Escalate incidents that impact enterprise customers for more than 30 minutes.",
      "Use runbook templates with assumptions, blast radius, and mitigation options.",
      "Recommendations should be output as action items with owner and due date.",
    ].join("\n\n"),
    { source: "internal-handbook" },
  );

  const context = await rag.retrieve("How should I report an incident?");
  logger.info("Retrieved context", context);

  const agent = new ToolCallingAgent(llm, tools, logger);
  const result = await agent.run(
    `Incident update needed. Context: ${context.join(" | ")}. Please provide recommendation.`,
  );

  const evaluation = evaluateAnswer(result.answer);
  sessionMemory.add("latestAnswer", result.answer);
  await fileMemory.append({
    key: "latestAnswer",
    value: result.answer,
    createdAt: new Date().toISOString(),
  });

  return {
    ...result,
    evaluation,
    memorySnapshot: sessionMemory.all(),
  };
}
