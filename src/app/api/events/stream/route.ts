import { getRequestUser } from "@/lib/auth/session";
import { createEventStream } from "@/lib/realtime/pubsub";

export async function GET() {
  const user = await getRequestUser();
  const stream = createEventStream(user.id);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
