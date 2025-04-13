import { DataSource } from 'typeorm';
import { Config as cfg, IsProduction } from '../constanta';
import { Users } from '../database/models/Users';
import { Roles } from '../database/models/Roles';
import { UserLog } from '../database/models/UserLog';
import { MasterModule } from '../database/models/MasterModule';
import { MasterMenu } from '../database/models/MasterMenu';
import { RoleModuleAssociation } from '../database/models/RoleModuleAssociation';
import { ModuleMenuAssociation } from '../database/models/ModuleMenuAssociation';
import { SPPDKopSurat } from '../database/models/SPPDKopsurat';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: cfg.DbHost,
  port: cfg.DbPort,
  username: cfg.DbUser,
  password: cfg.DbPass,
  database: cfg.DbName,
  synchronize: false,
  logging: !IsProduction,
  entities: [
    Users,
    Roles,
    UserLog,
    MasterModule,
    MasterMenu,
    RoleModuleAssociation,
    ModuleMenuAssociation,
    SPPDKopSurat
  ], // Path to your entities
  migrations: ['src/database/migrations/*.ts'], // Path to your migrations,
  migrationsTableName: 'migrations',
});

export default AppDataSource;
