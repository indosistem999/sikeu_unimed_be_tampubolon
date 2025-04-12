import { DataSource } from 'typeorm';
import { Config as cfg, IsProduction } from '../constanta';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: cfg.DbHost,
  port: cfg.DbPort,
  username: cfg.DbUser,
  password: cfg.DbPass,
  database: cfg.DbName,
  synchronize: false,
  logging: !IsProduction,
  entities: ['src/database/models/*.ts'], // Path to your entities
  migrations: ['src/database/migrations/*.ts'], // Path to your migrations,
  migrationsTableName: 'migrations',
  extra: {
    connectionLimit: 10,
    queueLimit: 0,
    waitForConnections: true,
    connectTimeout: 10000
  },
  maxQueryExecutionTime: 5000
});

export default AppDataSource;
