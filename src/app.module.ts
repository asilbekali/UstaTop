import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RegionModule } from './region/region.module';
import { UserModule } from './user/user.module';
import { GeneralModule } from './general/general.module';
import { MulterModule } from './multe-r/multer.module';
import { ShowCaseModule } from './show-case/show-case.module';
import { SuggestionsModule } from './suggestions/suggestions.module';
import { PartnersModule } from './partners/partners.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
