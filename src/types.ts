import { IConfigsService } from "./interfaces/config.service.interface";
import { IStorage } from "./interfaces/storage.interface";
import { ITelegramService } from "./interfaces/telegram.service.interface";
import { IStorageConfig } from './interfaces/storage-config.interface';

export namespace Types {
  export namespace ConfigsService {
    export type TYPE = IConfigsService;
    export const TOKEN = Symbol.for("ConfigsService");
  }

  export namespace Storage {
    export type TYPE = IStorage;
    export const TOKEN = Symbol.for("Storage");
  }

  export namespace StorageConfig {
    export type TYPE = IStorageConfig;
    export const TOKEN = Symbol.for("StorageConfig");
  }

  export namespace TelegramService {
    export type TYPE = ITelegramService;
    export const TOKEN = Symbol.for("TelegramService");
  }
}
