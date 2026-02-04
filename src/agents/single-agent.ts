import type { LlmClient } from "../llm/client.js";
import type { Logger } from "../config/logger.js";
import type { Message } from "../types/models.js";
import { ToolRegistry } from "../types/tools.js";

export interface AgentRunResult {
  answer: string;
  steps: string[];
  usageUsd: number;
}

export class ToolCallingAgent {
  constructor(
    private readonly llm: LlmClient,
    private readonly tools: ToolRegistry,
    private readonly logger: Logger,
  ) {}

  async run(goal: string): Promise<AgentRunResult> {
    const messages: Message[] = [{ role: "user", content: goal }];
    const steps: string[] = [];
    let usageUsd = 0;

    for (let i = 0; i < 4; i += 1) {
      const response = await this.llm.generate({
        systemPrompt:
          "You are an autonomous agent. Use tools when needed, then provide a concise final answer with assumptions and recommendations.",
        messages,
        availableTools: this.tools
          .list()
          .map((t) => ({ name: t.name, description: t.description })),
      });

      usageUsd += response.usage.estimatedUsd;
      steps.push(`llm: ${response.content}`);
      this.logger.debug("LLM response", response);

      if (!response.toolCalls?.length) {
        return { answer: response.content, steps, usageUsd };
      }

      for (const call of response.toolCalls) {
        const result = await this.tools.execute(call.name, call.input);
        messages.push({ role: "tool", name: call.name, content: JSON.stringify(result) });
        steps.push(`tool:${call.name}: ${JSON.stringify(result)}`);
      }
    }

    return {
      answer: "Final answer fallback: assumptions were made because loop limit was reached.",
      steps,
      usageUsd,
    };
  }
}
