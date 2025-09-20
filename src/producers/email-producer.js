const { mailerQueue } = require("../queues/mailer-queue");

const FORGOT_PASSWORD_EMAIL_JOB = "send:forgot-password-email";
const VERIFICATION_EMAIL_JOB = "send:verification-email";

/**
 * Adds a forgot password email job to the queue.
 * @param {Object} payload The data required to send the email.
 */
const addForgotPasswordEmailJob = async (payload) => {
  await mailerQueue.add(FORGOT_PASSWORD_EMAIL_JOB, payload);
};

const addVerificationEmailJob = async (payload) => {
  await mailerQueue.add(VERIFICATION_EMAIL_JOB, payload);
};

module.exports = {
  addForgotPasswordEmailJob,
  FORGOT_PASSWORD_EMAIL_JOB,
  addVerificationEmailJob,
  VERIFICATION_EMAIL_JOB,
};
