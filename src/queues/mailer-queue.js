const { Queue } = require("bullmq");
const { redisConnection } = require("../config/redis-config");

const MAILER_QUEUE = "mailer-queue";

const mailerQueue = new Queue(MAILER_QUEUE, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3, // 👈 default retries
    backoff: {
      type: "exponential",
      delay: 5000, // 5s, 10s, 20s...
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

module.exports = {
  mailerQueue,
  MAILER_QUEUE,
};
