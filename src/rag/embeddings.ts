export interface Embedder {
  embed(text: string): Promise<number[]>;
}

export class HashEmbedder implements Embedder {
  constructor(private readonly dims = 64) {}

  async embed(text: string): Promise<number[]> {
    const v = new Array<number>(this.dims).fill(0);

    for (const token of tokenize(text)) {
      const hash = murmurish(token);
      const idx = Math.abs(hash) % this.dims;
      v[idx] += 1;
    }

    return normalize(v);
  }
}

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}

function normalize(v: number[]): number[] {
  const mag = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
  if (mag === 0) {
    return v;
  }
  return v.map((x) => x / mag);
}

function murmurish(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(31, h) + str.charCodeAt(i);
    h |= 0;
  }
  return h;
}
