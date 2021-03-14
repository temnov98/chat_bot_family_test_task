import "reflect-metadata";
import { applicationContainer } from "./inversify.config";
import { Types } from "./types";

async function main(): Promise<void> {
  const telegramService = applicationContainer.get<Types.TelegramService.TYPE>(Types.TelegramService.TOKEN);
  telegramService.start();

  console.log('Started');
}

main();
