const { Logger } = require("../config");
const { redisConnection } = require("../config/redis-config");
const {
  VERIFICATION_TOKEN_PAYLOAD,
  RESET_TOKEN_PAYLOAD,
  UNVERIFIED_ACCOUNT_PAYLOAD,
} = require("../producers/token-producer");
const { TOKEN_QUEUE } = require("../queues/token-queue");
const { Worker } = require("bullmq");
const { UserService } = require("../services");

const setupTokenJobWorker = () => {
  // Worker to process token-related jobs
  const tokenProcessor = new Worker(
    TOKEN_QUEUE,
    async (job) => {
      switch (job.name) {
        case VERIFICATION_TOKEN_PAYLOAD:
          const v = await UserService.clearExpiredVerificationToken();
          Logger.info(`✅ Cleared ${v.count} expired verification tokens`);
          break;

        case RESET_TOKEN_PAYLOAD:
          const r = await UserService.clearExpiredResetToken();
          Logger.info(`✅ Cleared ${r.count} expired reset tokens`);
          break;

        case UNVERIFIED_ACCOUNT_PAYLOAD:
          const d = await UserService.deleteUnverifiedAccounts(
            job.data.expiryHours
          );
          Logger.info(`✅ Deleted ${d.count} unverified accounts`);
          break;

        default:
          Logger.warn(`⚠️ Unknown job: ${job.name}`);
      } //process fn
    },
    { connection: redisConnection }
  );

  tokenProcessor.on("failed", () => {
    console.error("Token processing failed");
  });

  tokenProcessor.on("completed", () => {
    console.log("Token processing completed successfully");
  });
  Logger.info("👷 Worker listening for jobs...");
};

module.exports = {
  setupTokenJobWorker,
};
