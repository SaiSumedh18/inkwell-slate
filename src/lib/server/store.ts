import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Key-value storage for orders.
 * - In production: Upstash Redis over its REST API (env vars are added by the
 *   Vercel Marketplace integration).
 * - In local development (`npm run dev`): a JSON file in `.data/`, so test orders
 *   never reach the live database. Set USE_REMOTE_STORE=true to use Redis locally.
 */
export interface Store {
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
  pushToList(list: string, value: string): Promise<void>;
  range(list: string, count: number): Promise<string[]>;
}

const redisUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export class StoreNotConfiguredError extends Error {
  constructor() {
    super("Order storage is not configured. Connect an Upstash Redis database in Vercel.");
  }
}

function redisStore(url: string, token: string): Store {
  async function command<T>(...args: string[]): Promise<T> {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    const body = (await res.json()) as { result?: T; error?: string };
    if (!res.ok || body.error) throw new Error(`Redis error: ${body.error ?? res.status}`);
    return body.result as T;
  }
  return {
    set: async (k, v) => void (await command("SET", k, v)),
    get: (k) => command<string | null>("GET", k),
    pushToList: async (l, v) => void (await command("LPUSH", l, v)),
    range: (l, n) => command<string[]>("LRANGE", l, "0", String(n - 1)),
  };
}

function fileStore(): Store {
  const file = path.join(process.cwd(), ".data", "store.json");
  type Data = { kv: Record<string, string>; lists: Record<string, string[]> };
  const load = async (): Promise<Data> => {
    try {
      return JSON.parse(await readFile(file, "utf8"));
    } catch {
      return { kv: {}, lists: {} };
    }
  };
  const save = async (d: Data) => {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, JSON.stringify(d, null, 2));
  };
  return {
    async set(k, v) {
      const d = await load();
      d.kv[k] = v;
      await save(d);
    },
    async get(k) {
      return (await load()).kv[k] ?? null;
    },
    async pushToList(l, v) {
      const d = await load();
      (d.lists[l] ??= []).unshift(v);
      await save(d);
    },
    async range(l, n) {
      return ((await load()).lists[l] ?? []).slice(0, n);
    },
  };
}

export function getStore(): Store {
  const isLocalDev =
    process.env.NODE_ENV === "development" && process.env.USE_REMOTE_STORE !== "true";
  if (redisUrl && redisToken && !isLocalDev) return redisStore(redisUrl, redisToken);
  // Vercel's filesystem is read-only and temporary, so refuse rather than lose orders.
  if (process.env.VERCEL) throw new StoreNotConfiguredError();
  return fileStore();
}
