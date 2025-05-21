import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './No_Connection_Tables/prisma/prisma.module';
import { RegionModule } from './No_Connection_Tables/region/region.module';
import { UserModule } from './No_Connection_Tables/user/user.module';
import { GeneralModule } from './No_Connection_Tables/general/general.module';
import { MulterModule } from '@nestjs/platform-express';
import { ShowCaseModule } from './No_Connection_Tables/show-case/show-case.module';
import { SuggestionsModule } from './No_Connection_Tables/suggestions/suggestions.module';
import { PartnersModule } from './No_Connection_Tables/partners/partners.module';
import { FaqModule } from './No_Connection_Tables/faq/faq.module';
import { LevelModule } from './level/level.module';

@Module({
  imports: [
    PrismaModule,
    RegionModule,
    UserModule,
    GeneralModule,
    MulterModule,
    ShowCaseModule,
    SuggestionsModule,
    PartnersModule,
    FaqModule,
    LevelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
