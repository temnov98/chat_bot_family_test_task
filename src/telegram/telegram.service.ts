import { Telegraf } from 'telegraf';
import { inject, injectable } from "inversify";
import { Types } from "../types";

@injectable()
export class TelegramService implements Types.TelegramService.TYPE {
  // #region Injectcs
  
  @inject(Types.ConfigsService.TOKEN)
  private readonly configsService!: Types.ConfigsService.TYPE;
  
  @inject(Types.Storage.TOKEN) 
  private readonly storage!: Types.Storage.TYPE;

  // #endregion

  // #region Public Methods

  public async start(): Promise<void> {
    console.log('ENV: ');
    console.log(this.configsService.telegram);
  }

  // #endregion
}
