export interface AppConfig {
  logLevel: "debug" | "info";
}

export function loadConfig(): AppConfig {
  const logLevel = process.env.LOG_LEVEL === "debug" ? "debug" : "info";
  return { logLevel };
}
