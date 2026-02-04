import type { ZodSchema } from "zod";

export interface ToolDefinition<TInput extends Record<string, unknown> = Record<string, unknown>> {
  name: string;
  description: string;
  schema: ZodSchema<TInput>;
  run: (input: TInput) => Promise<unknown>;
}

export class ToolRegistry {
  private readonly tools = new Map<string, ToolDefinition<Record<string, unknown>>>();

  register<TInput extends Record<string, unknown>>(tool: ToolDefinition<TInput>): void {
    this.tools.set(tool.name, tool as ToolDefinition<Record<string, unknown>>);
  }

  list(): ToolDefinition<Record<string, unknown>>[] {
    return [...this.tools.values()];
  }

  async execute(name: string, rawInput: Record<string, unknown>) {
    const tool = this.tools.get(name);
    if (!tool) {
      return { ok: false, data: null, error: `Unknown tool: ${name}` };
    }

    const parsed = tool.schema.safeParse(rawInput);
    if (!parsed.success) {
      const details = parsed.error.issues
        .map((issue) => `${issue.path.join(".") || "input"}: ${issue.message}`)
        .join("; ");
      return {
        ok: false,
        data: null,
        error: `Validation failed: ${details}`,
      };
    }

    try {
      const data = await tool.run(parsed.data);
      return { ok: true, data };
    } catch (error) {
      return {
        ok: false,
        data: null,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
