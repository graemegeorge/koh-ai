import type { AppConfig } from "./env.js";

export class Logger {
  constructor(private readonly config: AppConfig) {}

  info(message: string, context?: unknown) {
    console.log(`[INFO] ${message}`, context ?? "");
  }

  debug(message: string, context?: unknown) {
    if (this.config.logLevel === "debug") {
      console.log(`[DEBUG] ${message}`, context ?? "");
    }
  }

  error(message: string, context?: unknown) {
    console.error(`[ERROR] ${message}`, context ?? "");
  }
}
