const { Queue } = require("bullmq");
const { redisConnection } = require("../config/redis-config");

const MAILER_QUEUE = "mailer-queue";

const mailerQueue = new Queue(MAILER_QUEUE, { redisConnection });

module.exports = {
  mailerQueue,
  MAILER_QUEUE,
};
