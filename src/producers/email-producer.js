const { mailerQueue } = require("../queues/mailer-queue");

const SEND_FORGOT_PASSWORD_EMAIL_PAYLOAD = "send-forgot-password-email";
const SEND_VERIFICATION_EMAIL_PAYLOAD = "send-verification-email";

const addForgotPasswordEmailJob = async (payload) => {
  await mailerQueue.add(SEND_FORGOT_PASSWORD_EMAIL_PAYLOAD, payload);
};

const addVerificationEmailJob = async (payload) => {
  await mailerQueue.add(SEND_VERIFICATION_EMAIL_PAYLOAD, payload);
};

module.exports = {
  addForgotPasswordEmailJob,
  SEND_FORGOT_PASSWORD_EMAIL_PAYLOAD,
  addVerificationEmailJob,
  SEND_VERIFICATION_EMAIL_PAYLOAD,
};
