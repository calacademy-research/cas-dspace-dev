const winston = require('winston');

const highestLevel = 'info';

const Logger = winston.createLogger({
  format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
            }),
        winston.format.splat(),
        winston.format.json(),
        winston.format.prettyPrint(),
  ),
  defaultMeta: {logger: 'winston'},
  transports: [
    new winston.transports.Console({ level: highestLevel })
  ]
});

export default Logger;