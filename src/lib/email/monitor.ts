import { ImapFlow } from "imapflow";
import { getEnv } from "@/lib/env/server";
import { logger } from "@/lib/logger";

type InboxConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
};

export async function createImapMonitor(config: InboxConfig) {
  const client = new ImapFlow({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    logger: false,
    clientInfo: {
      name: "SubUnited",
      version: getEnv().NODE_ENV,
    },
  });

  client.on("error", (error) => {
    logger.error({ error }, "IMAP monitor error");
  });

  await client.connect();
  return client;
}
