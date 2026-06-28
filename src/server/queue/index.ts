import { Queue, Worker, QueueEvents } from "bullmq";
import { getEnv } from "@/lib/env/server";

function getConnection() {
  return {
    url: getEnv().REDIS_URL,
  };
}

export function getQueues() {
  const connection = getConnection();

  return {
    payments: new Queue("payments", { connection }),
    renewals: new Queue("renewals", { connection }),
    analytics: new Queue("analytics", { connection }),
    emailOtps: new Queue("email-otps", { connection }),
  };
}

export function getQueueEvents() {
  const connection = getConnection();

  return {
    payments: new QueueEvents("payments", { connection }),
  };
}

export function createWorker(
  name: string,
  processor: ConstructorParameters<typeof Worker>[1],
) {
  return new Worker(name, processor, { connection: getConnection() });
}
