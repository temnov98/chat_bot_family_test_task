import { Telegraf } from 'telegraf';
import { inject, injectable } from "inversify";
import { Types } from "../types";
import { Commands } from './commands.enum';

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
    const bot = new Telegraf(this.configsService.telegram.botToken);

    bot.command(Commands.AddItem, async (ctx) => {
      if (ctx.chat.id.toString() !== this.configsService.telegram.adminChatId) {
        ctx.reply(`Incorrect command`);
        return;
      }

      const item: string | undefined = ctx.message.text.split(' ')[1];
      if (!item) {
        ctx.reply(`Empty item`);
        return;
      }

      try {
        await this.storage.addItem(item);
        ctx.reply(`Added: ${item}`);
      } catch (e) {
        ctx.reply(`Error: ${e.message}`);
      }
    });

    bot.command(Commands.ShowAllItems, async (ctx) => {
      const items = await this.storage.getAllItems();
      if (items.length === 0) {
        ctx.reply(`No items`);
        return;
      }

      ctx.reply(`Items:\n${items.join('\n')}`);
    });

    bot.command(Commands.ShowMyBag, async (ctx) => {
      try {
        const items = await this.storage.getItemsInBag(ctx.chat.id.toString());
        if (items.length === 0) {
          ctx.reply(`No items`);
          return;
        }
  
        ctx.reply(`Items:\n${items.join('\n')}`);
      } catch (e) {
        ctx.reply(`Something wrong`);
      }
    });

    bot.command(Commands.AddItemToBag, async (ctx) => {
      const item: string | undefined = ctx.message.text.split(' ')[1];
      if (!item) {
        ctx.reply(`Empty item`);
        return;
      }

      const itemExists = await this.storage.itemExists(item);
      if (!itemExists) {
        ctx.reply(`Item ${item} not exists`);
        return;
      }

      try {
        await this.storage.addItemToBag(ctx.chat.id.toString(), item);
        ctx.reply(`Added: ${item}`);
      } catch (e) {
        ctx.reply(`Something wrong`);
      }
    });

    bot.command(Commands.ClearBag, async (ctx) => {
      try {
        const items = await this.storage.clearBag(ctx.chat.id.toString());
        ctx.reply(`Cleared`);
      } catch (e) {
        ctx.reply(`Something wrong`);
      }
    });

    bot.command(Commands.Start, (ctx) => {
      if (ctx.chat.id.toString() !== this.configsService.telegram.adminChatId) {
        ctx.reply(`/items - get all items\n/bag - show my bag\nadd_item <item_name> - add item`);
        ctx.reply([
          `${Commands.ShowAllItems} - show all items`,
          `${Commands.ShowMyBag} - show my bag`,
          `${Commands.AddItemToBag} <item_name> - add item`,
          `${Commands.ClearBag} - clear bag`,
        ].join('\n'));
      } else {
        ctx.reply([
          'User methods: ',
          `${Commands.ShowAllItems} - show all items`,
          `${Commands.ShowMyBag} - show my bag`,
          `${Commands.AddItemToBag} <item_name> - add item`,
          `${Commands.ClearBag} - clear bag`,
          'Admin methods: ',
          `${Commands.AddItem} <item_name> - add item`,
        ].join('\n'));
      }
    });

    bot.launch();
  }

  // #endregion

  // #region Private Methods

  // #endregion
}
