import { Module } from '@nestjs/common';
import { MasterService } from './master.service';
import { MasterController } from './master.controller';
import { PrismaModule } from 'src/No_Connection_Tables/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MasterController],
  providers: [MasterService],
})
export class MasterModule {}
