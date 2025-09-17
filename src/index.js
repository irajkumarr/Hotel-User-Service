const express = require("express");
const { ServerConfig } = require("./config");
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

//Server starting
app.listen(ServerConfig.PORT, () => {
  console.log(`Server started at PORT ${ServerConfig.PORT}`);
  CRONS();
});
