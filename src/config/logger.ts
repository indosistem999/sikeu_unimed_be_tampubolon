import fs from 'fs';
import winston from 'winston';
import morgan, { StreamOptions } from 'morgan';
import { IsProduction } from '../constanta';
import 'winston-daily-rotate-file';
import path from 'path';

const getPathLogDirectory = (): string => {
  const definePath: string = '../../logs';
  return path.resolve(__dirname, definePath);
};

const ensureLogDirectory = (): void => {
  const logPath = getPathLogDirectory();
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
  }
};

export const Logger = (): winston.Logger => {
  ensureLogDirectory();
  const logPath = getPathLogDirectory();
  const defLog: winston.Logger = winston.createLogger({
    level: IsProduction ? 'info' : 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level} : ${message}`;
      })
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: path.join(logPath, 'error.log'),
        level: 'error',
      }),
      new winston.transports.File({
        filename: path.join(logPath, 'combined.log'),
      }),
      new winston.transports.DailyRotateFile({
        filename: path.join(logPath, 'application-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '14d',
        maxSize: '20m',
      }),
    ],
  });

  if (!IsProduction) {
    defLog.add(new winston.transports.Console({ format: winston.format.simple() }));
  }

  return defLog;
};

const stream: StreamOptions = {
  write: (message: string) => {
    return Logger().info(message.trim());
  },
};

export const httpLogger = morgan(IsProduction ? 'combined' : 'dev', { stream });
