const express = require("express");
const { ServerConfig, Logger } = require("./config");
const apiRoutes = require("./routes");
const { errorHandler } = require("./middlewares");
const morgan = require("morgan");

const CRONS = require("./utils/common/cron-jobs");

const app = express();

//* Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//routes
app.use("/api", apiRoutes);

//* Error Handler
app.use(errorHandler);

//* Start cron jobs
CRONS();

//Server starting
app.listen(ServerConfig.PORT, () => {
  Logger.info(`🚀 Server started at PORT ${ServerConfig.PORT}`);
  Logger.info(`Press Ctrl+C to stop the server.`);
});
