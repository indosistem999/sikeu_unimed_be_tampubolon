import { DataSource } from 'typeorm';
import { Config as cfg, IsProduction } from '../constanta';
import path from 'path';

const rootPath = path.resolve(__dirname, '../../');

const AppDataSource = new DataSource({
  type: 'mysql',
  host: cfg.DbHost,
  port: cfg.DbPort,
  username: cfg.DbUser,
  password: cfg.DbPass,
  database: cfg.DbName,
  synchronize: false,
  logging: !IsProduction,
  entities: [rootPath + './src/database/models/*.ts'], // Path to your entities
  migrations: [rootPath + './src/database/migrations/*.ts'], // Path to your migrations,
  migrationsTableName: 'migrations',
});

export default AppDataSource;
