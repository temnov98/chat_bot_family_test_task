require('dotenv').config();
import * as Joi from "@hapi/joi";
import { injectable } from "inversify";
import { Types } from "../types";
import { IEnvConfig } from "./env-config.interface";
import { JoiSchema } from "./joi-schema.const";

@injectable()
export class ConfigsService implements Types.ConfigsService.TYPE {
  // #region Private Fields 

  private readonly envConfig: IEnvConfig;

  // #endregion

  // #region Public Methods

  constructor() {
    this.envConfig = this.validateInput(process.env);
  }

  public get tsNode() {
    return this.envConfig.TS_NODE;
  }

  public get telegram() {
    return {
      botToken: this.envConfig.TELEGRAM_BOT_TOKEN,
      adminChatId: this.envConfig.TELEGRAM_ADMIN_CHAT_ID,
    };
  }

  public get database() {
    return {
      database: this.envConfig.DATABASE_NAME,
      synchronize: this.envConfig.DATABASE_SYNCHRONIZE,
      logging: this.envConfig.DATABASE_LOGGING,
      migrations: {
        run: this.envConfig.DATABASE_MIGRATIONS_RUN,
        tableName: this.envConfig.DATABASE_MIGRATIONS_TABLE_NAME,
      },
    };
  }

  // #endregion

  // #region Private Methods

  private validateInput(envConfig: unknown): IEnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object(JoiSchema);

    const { error, value } = envVarsSchema.validate(envConfig, { allowUnknown: true });

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return value;
  }

  // #endregion
}
