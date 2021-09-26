const winston = require('winston');
const { combine, timestamp, printf, label, colorize } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} --${label} [${level}] : ${message}`;
});

const devLogger = (labelName) => {
  /* return winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            // - Write all logs with level `error` and below to `error.log`
            // - Write all logs with level `info` and below to `combined.log`
            new winston.transports.File({ filename: 'error.log', level: 'error' }),
            new winston.transports.File({ filename: 'combined.log' }),
        ],
    }); */
  return winston.createLogger({
    level: 'debug',
    format: combine(
      colorize(),
      label({ label: labelName }),
      timestamp(),
      myFormat
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: './log/devlogs.log',
        level: 'http',
      }),
    ],
  });
};

module.exports = devLogger;
