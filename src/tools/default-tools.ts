import { z } from "zod";
import { ToolRegistry } from "../types/tools.js";

export function createDefaultToolRegistry() {
  const registry = new ToolRegistry();

  registry.register({
    name: "search_docs",
    description: "Searches product documentation snippets by keyword.",
    schema: z.object({ query: z.string().min(2) }),
    run: async ({ query }: { query: string }) => {
      const docs = [
        "Usage limits are enforced per account and reset every hour.",
        "Escalations should include customer impact and urgency score.",
        "Integrations support webhook retries with exponential backoff.",
      ];

      return docs.filter((d) => d.toLowerCase().includes(query.toLowerCase()));
    },
  });

  registry.register({
    name: "calc_risk_score",
    description: "Calculates a simple support incident risk score.",
    schema: z.object({
      customersAffected: z.number().int().nonnegative(),
      durationMinutes: z.number().int().nonnegative(),
      hasDataLoss: z.boolean(),
    }),
    run: async ({
      customersAffected,
      durationMinutes,
      hasDataLoss,
    }: {
      customersAffected: number;
      durationMinutes: number;
      hasDataLoss: boolean;
    }) => {
      const score =
        customersAffected * 0.4 + durationMinutes * 0.3 + (hasDataLoss ? 30 : 0);

      if (score >= 75) return { score, severity: "critical" };
      if (score >= 35) return { score, severity: "high" };
      return { score, severity: "medium" };
    },
  });

  return registry;
}
