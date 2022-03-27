const winston = require("winston");
const { combine, timestamp, printf, colorize, align } = winston.format;

/**
 * Default logger using winston package
 * logger.error('error');
 * logger.warn('warn');
 * logger.info('info');
 * logger.verbose('verbose');
 * logger.debug('debug');
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "debug",
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message.trim()}`)
  ),
  transports: [new winston.transports.Console()],
});

module.exports = {
  logger,
};
