import type { LlmClient } from "../llm/client.js";

export interface MultiAgentResult {
  planner: string;
  executor: string;
  critic: string;
  final: string;
}

export class PlannerExecutorCritic {
  constructor(private readonly llm: LlmClient) {}

  async run(goal: string): Promise<MultiAgentResult> {
    const planner = await this.llm.generate({
      systemPrompt: "You are a planner. Return short execution plan.",
      messages: [{ role: "user", content: goal }],
      availableTools: [],
    });

    const executor = await this.llm.generate({
      systemPrompt: "You are an executor. Execute the plan and summarize result.",
      messages: [{ role: "user", content: planner.content }],
      availableTools: [],
    });

    const critic = await this.llm.generate({
      systemPrompt:
        "You are a critic. Find risks and improvement opportunities in the execution output.",
      messages: [{ role: "user", content: executor.content }],
      availableTools: [],
    });

    return {
      planner: planner.content,
      executor: executor.content,
      critic: critic.content,
      final: `${executor.content}\n\nQuality review:\n${critic.content}`,
    };
  }
}
