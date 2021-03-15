import { Container } from "inversify";
import { Types } from "./types";
import { SQLiteStorage } from "./storage/sqlite.storage";
import { ConfigsService } from "./configs/configs.service";
import { TelegramService } from "./telegram/telegram.service";

export const applicationContainer = new Container();

applicationContainer.bind<Types.StorageConfig.TYPE>(Types.StorageConfig.TOKEN).toConstantValue({ initConnection: true });
applicationContainer.bind<Types.ConfigsService.TYPE>(Types.ConfigsService.TOKEN).to(ConfigsService);
applicationContainer.bind<Types.Storage.TYPE>(Types.Storage.TOKEN).to(SQLiteStorage);
applicationContainer.bind<Types.TelegramService.TYPE>(Types.TelegramService.TOKEN).to(TelegramService);
