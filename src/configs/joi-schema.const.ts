import * as Joi from "@hapi/joi";
import { IEnvConfig } from "./env-config.interface";
import { JoiSchemaMap } from "./joi-schema-map.type";

export const JoiSchema: JoiSchemaMap<IEnvConfig> = {
  TS_NODE: Joi.boolean().default(false),

  TELEGRAM_BOT_TOKEN: Joi.string().required(),
  TELEGRAM_ADMIN_CHAT_ID: Joi.string().required(),

  DATABASE_NAME: Joi.string().required(),
  DATABASE_SYNCHRONIZE: Joi.boolean().default(false),
  DATABASE_LOGGING: Joi.boolean().default(false),
  DATABASE_MIGRATIONS_RUN: Joi.boolean().default(true),
  DATABASE_MIGRATIONS_TABLE_NAME: Joi.string().required(),
};
