import Redis from "ioredis";
import { getEnv } from "@/lib/env/server";

const globalForRedis = globalThis as unknown as {
  redis?: Redis;
};

export function getRedis() {
  if (globalForRedis.redis) {
    return globalForRedis.redis;
  }

  const redis = new Redis(getEnv().REDIS_URL, {
    maxRetriesPerRequest: null,
    enableAutoPipelining: true,
  });

  if (process.env.NODE_ENV !== "production") {
    globalForRedis.redis = redis;
  }

  return redis;
}
