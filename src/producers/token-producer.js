const { tokenQueue } = require("../queues/token-queue");

const VERIFICATION_TOKEN_PAYLOAD = "verification-token-payload";
const RESET_TOKEN_PAYLOAD = "reset-token-payload";
const UNVERIFIED_ACCOUNT_PAYLOAD = "unverified-account-payload";

const addVerificationTokenJobToQueue = async (payload) => {
  await tokenQueue.add(VERIFICATION_TOKEN_PAYLOAD, payload);
};

const addResetTokenJobToQueue = async (payload) => {
  await tokenQueue.add(RESET_TOKEN_PAYLOAD, payload);
};

const addUnverifiedAccountJobToQueue = async (payload) => {
  await tokenQueue.add(UNVERIFIED_ACCOUNT_PAYLOAD, payload);
};

module.exports = {
  addVerificationTokenJobToQueue,
  addResetTokenJobToQueue,
  addUnverifiedAccountJobToQueue,
  VERIFICATION_TOKEN_PAYLOAD,
  RESET_TOKEN_PAYLOAD,
  UNVERIFIED_ACCOUNT_PAYLOAD,
};
