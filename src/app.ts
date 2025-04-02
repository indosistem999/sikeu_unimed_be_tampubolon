import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import {
  errorMiddleware,
  removeFaviconMiddleware,
  syntaxErrorMiddleware,
} from './app/middlewares/error.middleware';
import { AppDataSource } from './config/database';
import { httpLogger, Logger } from './config/logger';
import { MessageDialog } from './lang';
import {
  setHeaderProtection,
  setHeaderLanguage,
  setCompression,
} from './app/middlewares/other.middleweare';
import { Config as cfg, IsProduction } from './constanta';
import { rabbitMqConfig } from './config/rabbitmq';
import routeDocumentation from './routes/routeDocumentation';
import RouteApplication from './routes/routeApplication'

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.inititalizeRoutes();
    this.initializeDatabase();
    // this.initializeRabbitMQ();
  }

  private initializeMiddleware(): void {
    this.app.use(setHeaderLanguage);
    this.app.use(setCompression());
    this.app.set('trust proxy', 1);

    // helmet config
    this.app.use(helmet.xPoweredBy());
    this.app.use(helmet.frameguard());
    this.app.use(helmet.xContentTypeOptions());
    this.app.use(helmet.referrerPolicy());

    // header protection
    this.app.use(setHeaderProtection);

    // cors
    this.app.use(
      cors({
        methods: cfg.AppMethod,
        allowedHeaders: cfg.AppAllowHeader,
        exposedHeaders: cfg.AppExposeHeader,
      })
    );

    this.app.use(express.json({ limit: cfg.AppJsonLimit }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(httpLogger);
    this.app.use(MessageDialog.init);
  }

  private inititalizeRoutes(): void {
    this.app.use(removeFaviconMiddleware);
    if (!IsProduction) {
      this.app.use(routeDocumentation);
    }
    this.app.use(RouteApplication); // Main Router Rest API
    this.app.use(syntaxErrorMiddleware);
    this.app.use(errorMiddleware);
  }

  private initializeDatabase(): void {
    AppDataSource.initialize()
      .then(() => {
        console.log('📦 Database connection established successfully!');
      })
      .catch((error) => {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
      });
  }

  private async initializeRabbitMQ(): Promise<void> {
    try {
      await rabbitMqConfig.connect();
      Logger().info('RabbitMQ connection initialized');
    } catch (error) {
      Logger().error('RabbitMQ connection error:', error);
    }
  }
}
