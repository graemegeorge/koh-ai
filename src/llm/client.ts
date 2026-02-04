import type { LlmResponse, Message } from "../types/models.js";

export interface LlmClient {
  generate(input: {
    systemPrompt: string;
    messages: Message[];
    availableTools: Array<{ name: string; description: string }>;
  }): Promise<LlmResponse>;
}
