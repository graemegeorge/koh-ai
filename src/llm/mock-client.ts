import type { LlmClient } from "./client.js";
import type { LlmResponse, Message } from "../types/models.js";

export class MockLlmClient implements LlmClient {
  async generate(input: {
    systemPrompt: string;
    messages: Message[];
    availableTools: Array<{ name: string; description: string }>;
  }): Promise<LlmResponse> {
    const last = input.messages[input.messages.length - 1]?.content.toLowerCase() ?? "";

    if (last.includes("incident") && hasTool(input.availableTools, "calc_risk_score")) {
      return {
        content: "I should calculate risk first.",
        toolCalls: [
          {
            name: "calc_risk_score",
            input: { customersAffected: 200, durationMinutes: 90, hasDataLoss: false },
          },
        ],
        usage: { inputTokens: 240, outputTokens: 40, estimatedUsd: 0.0014 },
      };
    }

    if (last.includes("limits") && hasTool(input.availableTools, "search_docs")) {
      return {
        content: "I should search docs first.",
        toolCalls: [{ name: "search_docs", input: { query: "limits" } }],
        usage: { inputTokens: 210, outputTokens: 38, estimatedUsd: 0.0012 },
      };
    }

    return {
      content:
        "Final answer: summarize tool outputs, cite assumptions, and return structured recommendations.",
      usage: { inputTokens: 180, outputTokens: 60, estimatedUsd: 0.0015 },
    };
  }
}

function hasTool(tools: Array<{ name: string }>, toolName: string): boolean {
  return tools.some((t) => t.name === toolName);
}
