import { Module } from '@nestjs/common';
import { OrderIteamController } from './order_iteam.controller';
import { OrderIteamService } from './order_iteam.service';
import { PrismaModule } from 'src/No_Connection_Tables/prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  controllers: [OrderIteamController],
  providers: [OrderIteamService],
})
export class OrderIteamModule {}
