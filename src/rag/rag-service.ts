import type { Embedder } from "./embeddings.js";
import { InMemoryVectorStore } from "./vector-store.js";

export class RagService {
  constructor(
    private readonly embedder: Embedder,
    private readonly store: InMemoryVectorStore,
  ) {}

  async ingestDocument(id: string, text: string, metadata: Record<string, string>) {
    const chunks = chunkText(text, 320);

    await Promise.all(
      chunks.map(async (chunk, index) => {
        const vector = await this.embedder.embed(chunk);
        this.store.upsert({
          id: `${id}-${index}`,
          text: chunk,
          metadata,
          vector,
        });
      }),
    );
  }

  async retrieve(query: string, k = 3): Promise<string[]> {
    const queryVector = await this.embedder.embed(query);
    return this.store.search(queryVector, k).map((c) => c.text);
  }
}

function chunkText(text: string, maxChars: number): string[] {
  const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  const output: string[] = [];
  let current = "";

  for (const p of paragraphs) {
    if ((current + "\n\n" + p).length > maxChars && current) {
      output.push(current);
      current = p;
    } else {
      current = current ? `${current}\n\n${p}` : p;
    }
  }

  if (current) {
    output.push(current);
  }

  return output;
}
