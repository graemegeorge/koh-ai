export interface Chunk {
  id: string;
  text: string;
  metadata: Record<string, string>;
  vector: number[];
}

export class InMemoryVectorStore {
  private readonly chunks: Chunk[] = [];

  upsert(chunk: Chunk) {
    const idx = this.chunks.findIndex((c) => c.id === chunk.id);
    if (idx >= 0) {
      this.chunks[idx] = chunk;
      return;
    }
    this.chunks.push(chunk);
  }

  search(queryVector: number[], k = 3): Chunk[] {
    return [...this.chunks]
      .map((chunk) => ({
        chunk,
        score: cosineSimilarity(queryVector, chunk.vector),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map((item) => item.chunk);
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * (b[i] ?? 0), 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  if (magA === 0 || magB === 0) {
    return 0;
  }

  return dot / (magA * magB);
}
