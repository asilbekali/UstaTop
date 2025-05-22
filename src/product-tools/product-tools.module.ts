import { Module } from '@nestjs/common';
import { ProductToolsService } from './product-tools.service';
import { ProductToolsController } from './product-tools.controller';
import { PrismaModule } from 'src/No_Connection_Tables/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductToolsController],
  providers: [ProductToolsService],
})
export class ProductToolsModule {}
