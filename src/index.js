const express = require("express");
const { ServerConfig, Logger } = require("./config");
const apiRoutes = require("./routes");
const { errorHandler } = require("./middlewares");
const morgan = require("morgan");

const CRONS = require("./scheduler/job-scheduler");
const { setupTokenJobWorker } = require("./processors/token-processor");
const {
  attachCorrelationIdMiddleware,
} = require("./middlewares/correlation-middleware");

const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { ExpressAdapter } = require("@bull-board/express");
const { tokenQueue } = require("./queues/token-queue"); // your BullMQ queue
const { mailerQueue } = require("./queues/mailer-queue"); // your BullMQ queue

const app = express();

//* Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(attachCorrelationIdMiddleware);

//routes
app.use("/api", apiRoutes);

//* Error Handler
app.use(errorHandler);

//* Start cron jobs
CRONS();

//* Start worker
setupTokenJobWorker();

//* Setup Bull Board dashboard
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(tokenQueue), new BullMQAdapter(mailerQueue)],
  serverAdapter,
});

// Mount the dashboard at /admin/queues
app.use("/admin/queues", serverAdapter.getRouter());

//Server starting
app.listen(ServerConfig.PORT, () => {
  Logger.info(`🚀 Server started at PORT ${ServerConfig.PORT}`);
  Logger.info(
    `BullMQ dashboard: http://localhost:${ServerConfig.PORT}/admin/queues`
  );
  Logger.info(`Press Ctrl+C to stop the server.`);
});
