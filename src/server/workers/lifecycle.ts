import { createWorker } from "@/server/queue";
import { logger } from "@/lib/logger";
import { enqueueRenewalReminders, expireDuePurchases } from "@/server/jobs/lifecycle";

export function startRenewalsWorker() {
  return createWorker("renewals", async (job) => {
    if (job.name === "expire-due-purchases") {
      return expireDuePurchases();
    }

    if (job.name === "send-renewal-reminders") {
      return enqueueRenewalReminders();
    }

    logger.warn({ jobName: job.name }, "Unhandled renewals job");
    return null;
  });
}
