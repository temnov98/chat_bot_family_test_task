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

  public get telegram() {
    return {
      botToken: this.envConfig.TELEGRAM_BOT_TOKEN,
      adminChatId: this.envConfig.TELEGRAM_ADMIN_CHAT_ID,
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
