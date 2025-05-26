import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { PrismaModule } from 'src/No_Connection_Tables/prisma/prisma.module';
import { TgService } from './tg.service';
@Module({
  imports: [
    TelegrafModule.forRoot({
      token: '8067098162:AAHE1w-Dt1_dm9GXcCq4y0xaflsAd4CcusI',
    }),
  ],
  providers: [TgService, PrismaModule],
  exports: []
})
export class TgModule {}
