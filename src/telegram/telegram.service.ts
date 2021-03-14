import { Context, Markup, Telegraf } from 'telegraf';
import { inject, injectable } from "inversify";
import { Types } from "../types";
import { Actions } from './actions.enum';
import { IState } from './state.interface';

@injectable()
export class TelegramService implements Types.TelegramService.TYPE {
  // #region Private Fieldsd

  private readonly chatIdToState: Map<string, IState> = new Map();

  // #endregion

  // #region Injectcs
  
  @inject(Types.ConfigsService.TOKEN)
  private readonly configsService!: Types.ConfigsService.TYPE;
  
  @inject(Types.Storage.TOKEN) 
  private readonly storage!: Types.Storage.TYPE;

  // #endregion

  // #region Public Methods

  public async start(): Promise<void> {    
    const bot = new Telegraf(this.configsService.telegram.botToken);

    bot.action(Actions.AddItem, this.onAddItem.bind(this));
    bot.action(Actions.ShowAllItems, this.onShowAllItems.bind(this));
    bot.action(Actions.ShowMyBag, this.onShowMyBag.bind(this));
    bot.action(Actions.AddItemToBag, this.onAddItemToBag.bind(this));
    bot.action(Actions.ClearBag, this.onClearBag.bind(this));
    bot.action(Actions.PlaceOrder, this.onPlaceOrder.bind(this));
    bot.action(Actions.PayOrder, this.onPayOrder.bind(this));
    bot.command('/start', this.onStart.bind(this));
    bot.on('text', this.onText.bind(this));

    bot.launch();
  }

  // #endregion

  // #region Private Methods


  private async onAddItem(ctx: Context): Promise<void> {
    if (!ctx.chat) {
      return;
    }

    if (ctx.chat.id.toString() !== this.configsService.telegram.adminChatId) {
      return;
    }

    const state = this.getState(ctx);
    state.mustEnterItemForAdd = true;
    ctx.reply(`Введите название товара:`);
  }

  private async onShowAllItems(ctx: Context): Promise<void> {
    const items = await this.storage.getAllItems();
      if (items.length === 0) {
        ctx.reply(`Нет товаров`);
        return;
      }

      ctx.reply(`Товары:\n${items.join('\n')}`);
  }

  private async onShowMyBag(ctx: Context): Promise<void> {
    if (!ctx.chat) {
      return;
    }

    try {
      const items = await this.storage.getItemsInBag(ctx.chat.id.toString());
      if (items.length === 0) {
        ctx.reply(`Нет товаров`);
        return;
      }

      ctx.reply(`Товары:\n${items.join('\n')}`);
    } catch (e) {
      ctx.reply(`Что-то пошло не так`);
    }
  }

  private async onAddItemToBag(ctx: Context): Promise<void> {
    if (!ctx.chat) {
      return;
    }

    const state = this.getState(ctx);
    state.mustEnterItemForAddToBag = true;
    ctx.reply(`Введите название товара:`);
  }

  private async onClearBag(ctx: Context): Promise<void> {
    if (!ctx.chat) {
      return;
    }

    try {
      await this.storage.clearBag(ctx.chat.id.toString());
      ctx.reply(`Корзина очищена. Нажмите /start для просмота доступных действий`);
    } catch (e) {
      ctx.reply(`Что-то пошло не так`);
    }
  }

  private async onPlaceOrder(ctx: Context): Promise<void> {
    if (!ctx.chat) {
      return;
    }

    const itemsInBag = await this.storage.getItemsInBag(ctx.chat.id.toString());
    if (itemsInBag.length === 0) {
      ctx.reply(`Корзина пуста!`);
      return;
    }

    const state = this.getState(ctx);
    state.mustPay = true;

    const buttons = [Markup.button.callback('Оплатил(а)', Actions.PayOrder)];
    const keyboard = Markup.inlineKeyboard(buttons, { columns: 1 });

    ctx.reply(`Оплатите заказ. Ваш заказ:\n${itemsInBag.join('\n')}`, keyboard);
  }

  private async onPayOrder(ctx: Context): Promise<void> {
    if (!ctx.chat) {
      return;
    }

    const state = this.getState(ctx);
    if (!state.mustPay) {
      ctx.reply(`Уже нельзя оплатить заказ. Попробуйте нажать /start`);
      return;
    }

    const itemsInBag = await this.storage.getItemsInBag(ctx.chat.id.toString());
    if (itemsInBag.length === 0) {
      ctx.reply(`Корзина пуста!`);
      return;
    }

    state.mustPay = false;
    await this.storage.clearBag(ctx.chat.id.toString());
    ctx.reply(`Ваш заказ оплачен!`);

    const orderId = await this.storage.payOrder(ctx.chat.id.toString());
    const adminMessage = `Пользователь (id = ${ctx.chat.id}) оплатил заказ.\nЕго корзина:\n${itemsInBag.join('\n')}.\nOrder id: ${orderId}`;
    ctx.telegram.sendMessage(this.configsService.telegram.adminChatId, adminMessage);
  }

  private async onStart(ctx: Context): Promise<void> {
    if (!ctx.chat) {
      return;
    }

    const itemsInBag = await this.storage.getItemsInBag(ctx.chat.id.toString());

    const buttons = [
      Markup.button.callback('Показать всё товары', Actions.ShowAllItems),      
      Markup.button.callback('Добавить товар в корзину', Actions.AddItemToBag),
    ];
    
    if (itemsInBag.length > 0) {
      buttons.push(...[
        Markup.button.callback(`Показать мою корзину (${itemsInBag.length} товаров)`, Actions.ShowMyBag),
        Markup.button.callback('Очистить корзину', Actions.ClearBag),
        Markup.button.callback('Оформить', Actions.PlaceOrder),
      ]);
    }

    if (ctx.chat.id.toString() === this.configsService.telegram.adminChatId) {
      buttons.push(Markup.button.callback('[Админка] Добавить товар', Actions.AddItem));
    }

    const keyboard = Markup.inlineKeyboard(buttons, { columns: 1 });

    ctx.reply('Выберите действие:', keyboard);
  }

  private async onText(ctx: Context & { message: { text: string }}): Promise<void> {
    if (!ctx.chat) {
      return;
    }

    if (!ctx.message) {
      return;
    }

    const state = this.getState(ctx);

    if (state.mustEnterItemForAdd) {
      const item: string | undefined = ctx.message.text;
        if (!item) {
        ctx.reply(`Вы не ввели название товара`);
        return;
      }

      try {
        await this.storage.addItem(item);
        ctx.reply(`Товар "${item}" добавлен.\nНажмите /start для просмотра доступных действий`);
      } catch (e) {
        ctx.reply(`Ошибка: ${e.message}`);
      }

      state.mustEnterItemForAdd = false;
      return;
    }

    if (state.mustEnterItemForAddToBag) {
      const item: string | undefined = ctx.message.text;
      if (!item) {
        ctx.reply(`Вы не ввели название товара`);
        return;
      }

      const itemExists = await this.storage.itemExists(item);
      if (!itemExists) {
        ctx.reply(`Товар "${item}" не найден`);
        return;
      }

      try {
        await this.storage.addItemToBag(ctx.chat.id.toString(), item);
        ctx.reply(`Товар "${item}" добавлен в корзину.\nНажмите /start для просмотра доступных действий`);
      } catch (e) {
        ctx.reply(`Что-то сломалось`);
      }

      state.mustEnterItemForAddToBag = false;
      return;
    }

    ctx.reply(`Что вы имели в виду?\nПопробуйте нажать /start`);
  }

  private getState(ctx: Context): IState {
    const defaultResult: IState = {
      mustEnterItemForAdd: false,
      mustEnterItemForAddToBag: false,
      mustPay: false,
    };

    if (!ctx.chat) {
      return defaultResult;
    }

    const chatId = ctx.chat.id.toString();
    const result = this.chatIdToState.get(chatId) || defaultResult;
    this.chatIdToState.set(chatId, result);

    return result;
  }

  // #endregion
}
