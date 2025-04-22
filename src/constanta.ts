import dotenv from 'dotenv';
dotenv.config();

export const IsProduction: boolean = process.env.NODE_ENV?.toString() === 'production';

export const SaltRounds: number = 10;

const getUrlRabbitMQ = (): string => {
  const rmqList = {
    host: process?.env?.RABBITMQ_HOST ?? 'localhost',
    port: process?.env?.RABBITMQ_PORT ?? '5672',
    user: process?.env?.RABBITMQ_USER ?? null,
    password: process?.env?.RABBITMQ_PASS ?? null
  }

  if (rmqList?.user == null) {
    return `amqp://${rmqList.host}:${rmqList.port}`;
  }

  return `amqp://${rmqList.user}:${rmqList.password}@${rmqList.host}:${rmqList.port}`;

}

const getContentSecurePolice = (): string | any => {
  if (IsProduction) {
    return process?.env?.APP_CONTENT_SECURITY_POLICY_PROD;
  }
  return process?.env?.APP_CONTENT_POLICY_DEV;
};

export const Config = {
  // Application
  AppHost: process.env.APP_HOST || 'http://localhost',
  AppName: process.env.APP_NAME?.toString() || 'boiler-api-core',
  AppPort: Number(process.env.APP_PORT) || 7701,
  AppLang: process.env.APP_LANG?.toString() || 'en',
  AppEnv: process.env.NODE_ENV?.toString() || 'development',
  AppAuthor: process.env.APP_AUTHOR?.toString() || 'Ruben Alpredo Tampubolon',
  AppDebug: Boolean(process.env.APP_DEBUG?.toString().toLowerCase()) || true,
  AppPermissionPolicy: process?.env?.APP_PERMISSION_POLICY ?? '',
  AppProtection: process?.env?.APP_PROTECTION ?? '',
  AppContentSecurityPolicy: getContentSecurePolice(),
  AppJsonLimit: process?.env?.APP_JSON_LIMIT ? `${process?.env?.APP_JSON_LIMIT}kb` : '500000kb',
  AppMethod: process?.env?.APP_METHOD ?? 'POST,PUT,DELETE,GET,OPTIONS',
  AppAllowHeader: process?.env?.APP_ALLOW_HEADER ?? 'POST,PUT,DELETE,GET,OPTIONS',
  AppExposeHeader: process?.env?.APP_EXPOSE_HEADER ?? 'POST,PUT,DELETE,GET,OPTIONS',
  AppDomain: process?.env?.APP_DOMAIN || '',
  FrontendDomain: process?.env?.FRONTEND_DOMAIN || 'https://sikeu-unimed.vercel.app',

  // Database
  DbHost: process.env.DB_HOST?.toString() || 'localhost',
  DbPort: Number(process.env.DB_PORT) || 5432,
  DbUser: process.env.DB_USER?.toString() || 'admin',
  DbPass: process.env.DB_PASS?.toString() || 'password',
  DbName: process.env.DB_NAME?.toString() || 'db_boiler',

  // Secret
  JwtSecretKey: process.env.JWT_SECRET_KEY?.toString() || 'defaultJwtSecret',
  UserDefaultPassword: process.env.USER_DEFAULT_PASSWORD?.toString() || 'password123',

  // Redis
  RedisHost: process.env.REDIS_HOST?.toString() || 'localhost',
  RedisPort: Number(process.env.REDIS_PORT) || 6379,
  RedisPass: process.env.REDIS_PASS?.toString() || 'password',

  // RabbitMQ
  RabbitMqUrl: getUrlRabbitMQ(),

  // Mail SMTP
  MailDriver: process.env.MAIL_DRIVER ?? 'smtp',
  MailHost: process.env.MAIL_HOST ?? 'smtp.mailtrap.io',
  MailPort: Number(process.env.MAIL_PORT ?? '2525'),
  MailUser: process.env.MAIL_USERNAME ?? 'd010bd981faee5',
  MailPass: process.env.MAIL_PASSWORD ?? 'aac26c8b410877',
  MailSecure: process.env.MAIL_SECURE?.toLowerCase() == 'false' ? false : true,
  MailFrom: process.env.MAIL_FROM ?? 'support@gmail.com',
  MailAlert: process.env.MAIL_ALERT_LIST ?? 'alpredo.tampubolon@gmail.com',
  MailIgnoreTLS: Boolean(process.env.MAIL_IGNORE_TLS ?? 'false'),

  // Customer
  CustomerPhone: process.env.CUSTOMER_PHONE ?? '0612234556',
  CustomerEmail: process.env.CUSTOMER_EMAIL ?? 'cs@support.com',

  // Simpeg Platform
  SimpegDosen: process.env.SIMPEG_DOSEN ?? 'https://simpeg.unimed.ac.id/jsonsimpeg/data/dosenDtaBuk.php?api_key=0dcd0d2a145c193a14d12e9226b4edbd798a0325',
  SimpegPegawai: process.env.SIMPEG_PEGAWAI ?? 'https://simpeg.unimed.ac.id/jsonsimpeg/data/tendikDtaBuk.php?api_key=0a3d643d8c2d238da5d920cb46453ab4e80b7b61',

};


export const LogType = {
  Register: 'register',
  Login: 'login',
}


export const QueueList = {
  Email: 'queue_email',
  LogActivity: 'queue_log_activity',
  ImportFile: {
    SppdPegawai: 'queue_import_sppd_pegawai',
  },
  SyncFile: {
    SppdPegawai: 'queue_sync_sppd_pegawai'
  },
  Default: 'queue_default',
  Notification: 'queue_notification'
}

export const ExchangeList = {
  Email: 'exchange_email',
  LogActivity: 'exchange_log_activity',
  ImportFile: {
    SppdPegawai: 'exchange_import_sppd_pegawai',
  },
  SyncFile: {
    SppdPegawai: 'exchange_sync_sppd_pegawai'
  },
  Default: 'exchange_default',
  Notification: 'exchange_notification'
}


export const optionalEmail = {
  forgotPassword: {
    subject: 'Request Reset Password and Receive New Token/OTP',
    template: 'forgotPassword',
    cc: ''
  },
  additional: {
    customer_phone: Config.CustomerPhone,
    customer_email: Config.CustomerEmail
  }
}

export const allSchema = {
  user: {
    primaryKey: 'user_id',
    tableName: 'users'
  },
  role: {
    primaryKey: 'role_id',
    tableName: 'roles'
  },
  work_unit: {
    tableName: 'master_work_unit',
    primaryKey: 'unit_id',
  },
  menu: {
    tableName: 'master_menu',
    primaryKey: 'menu_id',
  },
  module: {
    tableName: 'master_module',
    primaryKey: 'module_id',
  },
  sppd_pangkat: {
    tableName: 'sppd_pangkat_golongan',
    primaryKey: 'pangkat_id',
  },
  sppd_transportation: {
    tableName: 'sppd_jenis_transportasi',
    primaryKey: 'transportation_type_id',
  },
  sppd_cost: {
    tableName: 'sppd_jenis_biaya',
    primaryKey: 'cost_type_id',
  },
  budget_year: {
    tableName: 'master_budget_year',
    primaryKey: 'budget_id',
  },
  job_category: {
    tableName: 'master_job_category',
    primaryKey: 'job_category_id',
  },
  sumber_dana: {
    tableName: 'master_sumber_dana',
    primaryKey: 'sumber_dana_id',
  },
  master_officers: {
    tableName: 'master_officers',
    primaryKey: 'officers_id',
  },
  bagian_surat: {
    tableName: 'sppd_bagian_surat',
    primaryKey: 'bagian_surat_id',
  },
  kop_surat: {
    tableName: 'sppd_kopsurat',
    primaryKey: 'kopsurat_id',
  },
  pegawai: {
    tableName: 'sppd_pegawai',
    primaryKey: 'pegawai_id',
  },
  notification: {
    tableName: 'notifications',
    primaryKey: 'notification_id',
  },
  master_data_output: {
    tableName: 'master_data_output',
    primaryKey: 'output_id',
  },
  master_data_component: {
    tableName: 'master_data_component',
    primaryKey: 'component_id',
  },
  master_data_mak: {
    tableName: 'master_data_mak',
    primaryKey: 'mak_id',
  },
  pagu_anggaran: {
    tableName: 'pagu_anggaran',
    primaryKey: 'pagu_anggaran_id',
  }

}



export const ProcedureList = {
  SppdBeranda: {
    ChartMonthly: 'GetStatisticSppdBerandaChartMonthly',
    ChartYearly: 'GetStatisticSppdBerandaChartYearly'
  }
}