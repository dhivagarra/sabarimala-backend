import winston from 'winston';
import morgan from 'morgan';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

export const morganMiddleware = morgan('dev');