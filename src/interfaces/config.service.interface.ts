export interface IConfigsService {
  tsNode: boolean;
  telegram: ITelegramField;
  database: IDatabaseField;
}

interface ITelegramField {
  botToken: string;
  adminChatId: string;
}

interface IDatabaseField {
  database: string;
  synchronize: boolean;
  logging: boolean;
  migrations: {
    run: boolean;
    tableName: string;
  };
}
