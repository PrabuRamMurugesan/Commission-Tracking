const winston = require('winston');
const { createLogger, format, transports } = require('winston');

require('winston-daily-rotate-file');

// Configure log rotation (daily rotation)
const transport = new winston.transports.DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new transports.Console(), // Logs to console
    new transports.File({ filename: 'logs/app.log' })  // Logs to file
    // new winston.transports.Console(),
    // transport
  ]
});

module.exports = logger;
