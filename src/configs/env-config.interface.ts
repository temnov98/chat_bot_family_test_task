export interface IEnvConfig {
  TS_NODE: boolean;

  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_ADMIN_CHAT_ID: string;

  DATABASE_NAME: string;
  DATABASE_SYNCHRONIZE: boolean;
  DATABASE_LOGGING: boolean;
  DATABASE_MIGRATIONS_RUN: boolean;
  DATABASE_MIGRATIONS_TABLE_NAME: string;
}
