import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import {
  errorMiddleware,
  removeFaviconMiddleware,
  syntaxErrorMiddleware,
} from './app/middlewares/error.middleware';
import AppDataSource from './config/dbconfig';
import { httpLogger } from './config/logger';
import { MessageDialog } from './lang';
import {
  setHeaderProtection,
  setHeaderLanguage,
  setCompression,
} from './app/middlewares/other.middleweare';
import { Config as cfg } from './constanta';
import RouteApplication from './routes/routeApplication'
import { RunSubscribers } from './events/subscribers';

export class App {
  public app: Application;

  constructor() {
    this.app = express();

    // if(cfg.AppEnv?.toLowerCase() !== 'test') {
    //   RunSubscribers()
    // }


    this.initializeMiddleware();
    this.inititalizeRoutes();
    this.initializeDatabase();
  }

  protected initializeMiddleware(): void {
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


    const whitelist = [
      /^http:\/\/localhost:\d+$/, // Allow all localhost ports
      cfg.AppDomain,  // Replace with your production domain
      cfg.FrontendDomain
    ];

    // cors
    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || whitelist.some((rule) =>
            typeof rule === 'string' ? rule === origin : rule.test(origin)
          )) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Authorization'],
        credentials: true,
      })
    );

    this.app.use(express.json({ limit: cfg.AppJsonLimit }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(httpLogger);
    this.app.use(MessageDialog.init);
  }

  protected inititalizeRoutes(): void {
    this.app.use(removeFaviconMiddleware);
    this.app.use(RouteApplication); // Main Router Rest API
    this.app.use(syntaxErrorMiddleware);
    this.app.use(errorMiddleware);
  }

  protected initializeDatabase(): void {
    AppDataSource.initialize()
      .then(() => {
        console.log('📦 Database connection established successfully!');
      })
      .catch((error) => {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
      });
  }

}
