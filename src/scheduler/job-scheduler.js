const cron = require("node-cron");
const { Logger, ServerConfig } = require("../config");
const {
  addVerificationTokenJobToQueue,
  addResetTokenJobToQueue,
  addUnverifiedAccountJobToQueue,
  VERIFICATION_TOKEN_PAYLOAD,
  RESET_TOKEN_PAYLOAD,
  UNVERIFIED_ACCOUNT_PAYLOAD,
} = require("../producers/token-producer");

function scheduleCrons() {
  // Clear expired verification tokens
  cron.schedule("*/5 * * * *", async () => {
    await addVerificationTokenJobToQueue({});
    Logger.info(`🧹 Job queued: ${VERIFICATION_TOKEN_PAYLOAD}`);
  });

  // Clear expired reset password tokens
  cron.schedule("*/5 * * * *", async () => {
    await addResetTokenJobToQueue({});
    Logger.info(`🧹 Job queued: ${RESET_TOKEN_PAYLOAD}`);
  });

  // Delete accounts not verified within X hours
  cron.schedule("*/10 * * * *", async () => {
    const expiryHours = +ServerConfig.ACCOUNT_VERIFICATION_EXPIRY_HOURS || 1;
    await addUnverifiedAccountJobToQueue({ expiryHours });
    Logger.info(`🧹 Job queued: ${UNVERIFIED_ACCOUNT_PAYLOAD}`);
  });
}

module.exports = scheduleCrons;
