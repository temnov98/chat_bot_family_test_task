import { Container } from "inversify";
import { Types } from "./types";
import { InMemoryStorage } from "./storage/in-memory.storage";
import { ConfigsService } from "./configs/configs.service";
import { TelegramService } from "./telegram/telegram.service";

export const applicationContainer = new Container();

applicationContainer.bind<Types.ConfigsService.TYPE>(Types.ConfigsService.TOKEN).to(ConfigsService);
applicationContainer.bind<Types.Storage.TYPE>(Types.Storage.TOKEN).to(InMemoryStorage);
applicationContainer.bind<Types.TelegramService.TYPE>(Types.TelegramService.TOKEN).to(TelegramService);
