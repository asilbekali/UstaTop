import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RegionModule } from './region/region.module';
import { UserModule } from './user/user.module';
import { GeneralModule } from './general/general.module';
import { MulterModule } from './multe-r/multer.module';

@Module({
  imports: [
    PrismaModule,
    RegionModule,
    UserModule,
    GeneralModule,
    MulterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
