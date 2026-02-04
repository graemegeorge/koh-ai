export type Role = "system" | "user" | "assistant" | "tool";

export interface Message {
  role: Role;
  content: string;
  name?: string;
}

export interface ToolResult {
  ok: boolean;
  data: unknown;
  error?: string;
}

export interface LlmResponse {
  content: string;
  toolCalls?: Array<{ name: string; input: Record<string, unknown> }>;
  usage: {
    inputTokens: number;
    outputTokens: number;
    estimatedUsd: number;
  };
}
