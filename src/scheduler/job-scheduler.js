const cron = require("node-cron");
const { Logger, ServerConfig } = require("../config");
const {
  addVerificationTokenJobToQueue,
  addResetTokenJobToQueue,
  addUnverifiedAccountJobToQueue,
  VERIFICATION_TOKEN_JOB,
  RESET_TOKEN_JOB,
  UNVERIFIED_ACCOUNT_JOB,
} = require("../producers/token-producer");

function scheduleCrons() {
  // Clear expired verification tokens
  cron.schedule("*/5 * * * *", async () => {
    await addVerificationTokenJobToQueue({});
    Logger.info(`🧹 Job queued: ${VERIFICATION_TOKEN_JOB}`);
  });

  // Clear expired reset password tokens
  cron.schedule("*/5 * * * *", async () => {
    await addResetTokenJobToQueue({});
    Logger.info(`🧹 Job queued: ${RESET_TOKEN_JOB}`);
  });

  // Delete accounts not verified within X hours
  cron.schedule("*/10 * * * *", async () => {
    const expiryHours = +ServerConfig.UNVERIFIED_ACCOUNT_JOB || 1;
    await addUnverifiedAccountJobToQueue({ expiryHours });
    Logger.info(`🧹 Job queued: ${UNVERIFIED_ACCOUNT_JOB}`);
  });
}

module.exports = scheduleCrons;
