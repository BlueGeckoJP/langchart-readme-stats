import { UPDATE_INTERVAL_MS, } from "./constants.ts";

type Payload = {
  updatedAt: number;
  languages: Map<string, number>;
};

/**
 * Simple LRU cache implementation
 */
class LRUCache {
  private cache: Map<string, { value: Payload; timestamp: number }>;
  private maxSize: number;

  constructor(maxSize = 100,) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string,): Payload | null {
    const item = this.cache.get(key,);
    if (!item) return null;

    // Update timestamp to mark as recently used
    item.timestamp = Date.now();
    return item.value;
  }

  set(key: string, value: Payload,) {
    // If key exists, update value and timestamp
    if (this.cache.has(key,)) {
      const item = this.cache.get(key,);
      if (item) {
        item.value = value;
        item.timestamp = Date.now();
      }
      return;
    }

    // If at max size, remove least recently used item
    if (this.cache.size >= this.maxSize) {
      let lruKey: string | null = null;
      let lruTimestamp = Infinity;

      for (const [k, v,] of this.cache) {
        if (v.timestamp < lruTimestamp) {
          lruTimestamp = v.timestamp;
          lruKey = k;
        }
      }

      if (lruKey !== null) {
        this.cache.delete(lruKey,);
      }
    }

    // Add new item
    this.cache.set(key, { value, timestamp: Date.now(), },);
  }
}

export class Database {
  private kv: LRUCache;

  constructor(kv: LRUCache,) {
    this.kv = kv;
  }

  static create(): Database {
    const kv = new LRUCache();
    return new Database(kv,);
  }

  async get(username: string,): Promise<Payload | null> {
    const result = await this.kv.get(username,);
    return result;
  }

  async set(username: string, payload: Payload,): Promise<void> {
    await this.kv.set(username, payload,);
  }

  async getLanguageStats(
    username: string,
  ): Promise<Map<string, number> | null> {
    const payload = await this.get(username,);
    return payload ? payload.languages : null;
  }

  async setLanguageStats(
    username: string,
    languages: Map<string, number>,
  ): Promise<void> {
    const payload: Payload = {
      updatedAt: Date.now(),
      languages,
    };
    await this.set(username, payload,);
  }

  async shouldRefetch(username: string,): Promise<boolean> {
    const payload = await this.get(username,);
    if (!payload) {
      return true;
    }
    const nowTime = Date.now();
    return nowTime - payload.updatedAt > UPDATE_INTERVAL_MS;
  }
}

const database = await Database.create();
export default database;
