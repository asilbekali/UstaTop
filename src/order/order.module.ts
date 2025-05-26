import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/No_Connection_Tables/prisma/prisma.module';
import { TgModule } from 'src/tg/tg.module';

@Module({
  imports: [PrismaModule, TgModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
