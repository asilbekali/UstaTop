import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './No_Connection_Tables/prisma/prisma.module';
import { RegionModule } from './No_Connection_Tables/region/region.module';
import { UserModule } from './No_Connection_Tables/user/user.module';
import { GeneralModule } from './No_Connection_Tables/general/general.module';
import { ShowCaseModule } from './No_Connection_Tables/show-case/show-case.module';
import { SuggestionsModule } from './No_Connection_Tables/suggestions/suggestions.module';
import { PartnersModule } from './No_Connection_Tables/partners/partners.module';
import { FaqModule } from './No_Connection_Tables/faq/faq.module';
import { LevelModule } from './level/level.module';
import { CapacityModule } from './capacity/capacity.module';
import { SizeModule } from './size/size.module';
import { BrendModule } from './brend/brend.module';
import { ToolModule } from './tool/tool.module';
import { ProductModule } from './product/product.module';
import { MulterModule } from './No_Connection_Tables/multe-r/multer.module';

@Module({
  imports: [
    MulterModule,
    PrismaModule,
    RegionModule,
    UserModule,
    GeneralModule,
    ShowCaseModule,
    SuggestionsModule,
    PartnersModule,
    FaqModule,
    LevelModule,
    CapacityModule,
    SizeModule,
    BrendModule,
    ToolModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
