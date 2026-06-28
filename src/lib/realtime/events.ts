export type RealtimeEvent = {
  type: string;
  payload: Record<string, unknown>;
};

export function toSseMessage(event: RealtimeEvent) {
  return `event: ${event.type}\ndata: ${JSON.stringify(event.payload)}\n\n`;
}
