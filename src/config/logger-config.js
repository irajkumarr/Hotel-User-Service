const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;
require("winston-daily-rotate-file");

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp}: ${level}: ${message}`;
});

// Configure daily rotate
const dailyRotateTransport = new transports.DailyRotateFile({
  dirname: "logs",
  filename: "app-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: false,
  maxSize: "20m",
  maxFiles: "15m",
});

const logger = createLogger({
  format: combine(timestamp(), customFormat),
  transports: [dailyRotateTransport, new transports.Console()],
});

module.exports = logger;
