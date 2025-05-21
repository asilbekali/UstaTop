import { Module } from '@nestjs/common';
import { BrendService } from './brend.service';
import { BrendController } from './brend.controller';
import { PrismaModule } from 'src/No_Connection_Tables/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BrendController],
  providers: [BrendService],
})
export class BrendModule {}
