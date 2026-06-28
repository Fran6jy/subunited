import { getRedis } from "@/lib/redis";
import { toSseMessage, type RealtimeEvent } from "@/lib/realtime/events";

export async function publishUserEvent(userId: string, event: RealtimeEvent) {
  await getRedis().publish(`events:user:${userId}`, JSON.stringify(event));
}

export function createEventStream(userId: string) {
  const subscriber = getRedis().duplicate();
  const encoder = new TextEncoder();
  const channel = `events:user:${userId}`;

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      await subscriber.subscribe(channel);

      subscriber.on("message", (_, message) => {
        const event = JSON.parse(message) as RealtimeEvent;
        controller.enqueue(encoder.encode(toSseMessage(event)));
      });

      controller.enqueue(encoder.encode(": connected\n\n"));
    },
    async cancel() {
      await subscriber.unsubscribe(channel);
      subscriber.disconnect();
    },
  });
}
