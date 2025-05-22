import { Module } from '@nestjs/common';
import { ProductLevelService } from './product-level.service';
import { ProductLevelController } from './product-level.controller';
import { PrismaModule } from 'src/No_Connection_Tables/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductLevelController],
  providers: [ProductLevelService],
})
export class ProductLevelModule {}
