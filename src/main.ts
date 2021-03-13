import { ConfigsService } from "./configs/configs.service";

async function main(): Promise<void> {
  const configService = new ConfigsService();
  
  console.log('ENV:');
  console.log(configService.telegram);
}

main();
