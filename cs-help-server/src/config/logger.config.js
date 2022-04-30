const winston = require("winston");
const expressWinston = require("express-winston")
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
      format: "YYYY-MM-DD HH:mm:ss.SSS",
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message.trim()}`)
  ),
  transports: [new winston.transports.Console()],
});

module.exports = {
  logger,
  // needs to be called before our routes
  reqLoggerSetup: (app) => {

    app.use(expressWinston.logger({
      transports: [
        new winston.transports.Console()
      ],
      format: combine(
        colorize({ all: true }),
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss.SSS",
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message.trim()}`)
      ),
      meta: true, // optional: control whether you want to log the meta data about the request (default to true)
      msg: "{{req.method}} {{req.path}}: {{res.statusCode}} ({{res.responseTime}}ms)", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
      // expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
      colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
      // skip some log messages based on request and/or response
      // in this case, we don't want to log the redirect codes from oauth2
      ignoreRoute: function (req, res) { 
        // if (req.path.includes("/oauth2/redirect")) {
        //   return true;
        // } else {
          return false;
        // }
       } 
    }));


  },
  // needs to be called after our routes
  errLoggerSetup: (app) => {
    app.use(expressWinston.errorLogger({
      transports: [
        new winston.transports.Console()
      ],
      format: combine(
        colorize({ all: true }),
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss.SSS",
        }),
        align(),
        printf((info) => `<AUTO> [${info.timestamp}] ${info.level}: ${info.message.trim()}`)
      ),
    }));
  }
};
