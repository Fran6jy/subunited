import { createWorker } from "@/server/queue";
import { handleActivatePurchaseJob } from "@/server/jobs/purchases";
import { logger } from "@/lib/logger";

export function startPaymentsWorker() {
  return createWorker("payments", async (job) => {
    if (job.name === "activate-purchase") {
      return handleActivatePurchaseJob(job.data as { purchaseId: string });
    }

    logger.warn({ jobName: job.name }, "Unhandled payments job");
    return null;
  });
}
