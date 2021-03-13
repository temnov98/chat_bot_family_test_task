import * as Joi from "@hapi/joi";
import { IEnvConfig } from "./env-config.interface";
import { JoiSchemaMap } from "./joi-schema-map.type";

export const JoiSchema: JoiSchemaMap<IEnvConfig> = {
  TELEGRAM_BOT_TOKEN: Joi.string().required(),
  TELEGRAM_ADMIN_CHAT_ID: Joi.string().required(),
};
