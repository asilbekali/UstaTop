import { Module } from '@nestjs/common';
import { BacketService } from './backet.service';
import { BacketController } from './backet.controller';
import { PrismaModule } from 'src/No_Connection_Tables/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BacketController],
  providers: [BacketService],
})
export class BacketModule {}
