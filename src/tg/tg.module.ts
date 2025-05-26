import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { PrismaModule } from 'src/No_Connection_Tables/prisma/prisma.module';
import { TgService } from './tg.service';
@Module({
  providers: [TgService, PrismaModule],
  exports: [TgService],
})
export class TgModule {}
