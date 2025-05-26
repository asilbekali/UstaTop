import { Injectable } from '@nestjs/common';
import { Start } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class TgService {
  private bot: Telegraf<any>;

  constructor() {
    this.bot = new Telegraf('8067098162:AAHE1w-Dt1_dm9GXcCq4y0xaflsAd4CcusI');
    this.bot.launch();
  }

  @Start()
  async start(ctx: Context) {
    ctx.reply('Salom admin hush kelibsiz');
  }

  async sendMessageToAdmin(message: string) {
    const adminChatId = Number(7574860342);
    console.log(message);
    if (!adminChatId) {
      console.error('Admin chatId is not set!');
      return;
    }
    await this.bot.telegram.sendMessage(adminChatId, message);
  }
}
