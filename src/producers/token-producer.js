const { tokenQueue } = require("../queues/token-queue");

const VERIFICATION_TOKEN_JOB = "verification-token-payload";
const RESET_TOKEN_JOB = "reset-token-payload";
const UNVERIFIED_ACCOUNT_JOB = "unverified-account-payload";

const addVerificationTokenJobToQueue = async (payload) => {
  await tokenQueue.add(VERIFICATION_TOKEN_JOB, payload);
};

const addResetTokenJobToQueue = async (payload) => {
  await tokenQueue.add(RESET_TOKEN_JOB, payload);
};

const addUnverifiedAccountJobToQueue = async (payload) => {
  await tokenQueue.add(UNVERIFIED_ACCOUNT_JOB, payload);
};

module.exports = {
  addVerificationTokenJobToQueue,
  addResetTokenJobToQueue,
  addUnverifiedAccountJobToQueue,
  VERIFICATION_TOKEN_JOB,
  RESET_TOKEN_JOB,
  UNVERIFIED_ACCOUNT_JOB,
};
