import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Config as cfg, IsProduction } from '../constanta';
import path from 'path';

const rootPath = path.resolve(__dirname, '../../');

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: cfg.DbHost,
  port: cfg.DbPort,
  username: cfg.DbUser,
  password: cfg.DbPass,
  database: cfg.DbName,
  synchronize: true,
  logging: !IsProduction,
  entities: [rootPath + './src/database/models/*.ts'], // Path to your entities
  migrations: [rootPath + './src/database/migrations/*.ts'], // Path to your migrations,
  migrationsTableName: 'migrations',
});

AppDataSource.initialize()
  .then(() => console.log('Database connected successfully!'))
  .catch((error) => console.error('Database connection error:', error));
