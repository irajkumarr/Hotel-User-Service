const cron = require("node-cron");
const { UserService } = require("../services");
const { Logger, ServerConfig } = require("../config");
const { clearOldCombinedLog } = require("../services/log-cleaner");

function scheduleCrons() {
  // Clear expired verification tokens
  cron.schedule("*/5 * * * *", async () => {
    try {
      const result = await UserService.clearExpiredVerificationToken();

      if (result.count > 0) {
        Logger.info(`🧹 Cleared ${result.count} expired verification tokens`);
      }
    } catch (err) {
      Logger.error(
        `Error clearing expired verification tokens: ${err.message}`
      );
    }
  });

  // Clear expired reset password tokens
  cron.schedule("*/5 * * * *", async () => {
    try {
      const result = await UserService.clearExpiredResetToken();

      if (result.count > 0) {
        Logger.info(`🧹 Cleared ${result.count} expired reset password tokens`);
      }
    } catch (err) {
      Logger.error(`Error clearing expired reset tokens: ${err.message}`);
    }
  });

  // Delete accounts not verified within X hours
  cron.schedule("*/10 * * * *", async () => {
    try {
      const expiryHours = +ServerConfig.ACCOUNT_VERIFICATION_EXPIRY_HOURS || 1;
      const result = await UserService.deleteUnverifiedAccounts(expiryHours);

      if (result.count > 0) {
        Logger.info(`🧹 Deleted ${result.count} unverified accounts`);
      }
    } catch (err) {
      Logger.error(`Error deleting unverified accounts: ${err.message}`);
    }
  });

  // Clear combined.log if older than 15 minutes
  cron.schedule("*/5 * * * * *", async () => {
    try {
      const result = await clearOldCombinedLog(15);
      if (result.cleared) {
        Logger.info("🧹 Cleared old combined.log (older than 15 mins)");
      }
    } catch (err) {
      Logger.error(`Error clearing combined.log: ${err.message}`);
    }
  });
}

module.exports = scheduleCrons;
