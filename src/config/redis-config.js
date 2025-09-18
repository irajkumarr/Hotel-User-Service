const IORedis = require("ioredis");
const serverConfig = require("./server-config");

// Redis connection
const redisConnection = new IORedis(serverConfig.REDIS_URL, {
  maxRetriesPerRequest: null, // required for BullMQ
});

redisConnection.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redisConnection.on("error", (err) => {
  console.error("❌ Redis connection error:", err.message);
});

module.exports = { redisConnection };
