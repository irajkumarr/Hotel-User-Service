const { Queue } = require("bullmq");

const { redisConnection } = require("../config/redis-config");

const TOKEN_QUEUE = "token-queue";
const tokenQueue = new Queue(TOKEN_QUEUE, { redisConnection });

module.exports = { tokenQueue, TOKEN_QUEUE };
