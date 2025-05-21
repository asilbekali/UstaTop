import { Module } from '@nestjs/common';
import { ShowCaseService } from './show-case.service';
import { ShowCaseController } from './show-case.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ShowCaseController],
  providers: [ShowCaseService],
})
export class ShowCaseModule {}
