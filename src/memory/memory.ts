import { promises as fs } from "node:fs";
import path from "node:path";

export interface MemoryRecord {
  key: string;
  value: string;
  createdAt: string;
}

export class SessionMemory {
  private readonly records: MemoryRecord[] = [];

  add(key: string, value: string) {
    this.records.push({ key, value, createdAt: new Date().toISOString() });
  }

  all() {
    return [...this.records];
  }
}

export class FileMemory {
  constructor(private readonly filePath: string) {}

  async append(record: MemoryRecord) {
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });

    const current = await this.read();
    current.push(record);
    await fs.writeFile(this.filePath, JSON.stringify(current, null, 2));
  }

  async read(): Promise<MemoryRecord[]> {
    try {
      const raw = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(raw) as MemoryRecord[];
    } catch {
      return [];
    }
  }
}
