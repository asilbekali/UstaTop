import { Module } from '@nestjs/common';
import { CapacityService } from './capacity.service';
import { CapacityController } from './capacity.controller';
import { PrismaModule } from 'src/No_Connection_Tables/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CapacityController],
  providers: [CapacityService],
})
export class CapacityModule {}
