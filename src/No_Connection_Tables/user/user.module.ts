import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TgModule } from 'src/tg/tg.module';
@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: 'ustatop',
      signOptions: { expiresIn: '1h' },
      global: true,
    }),
    TgModule
  ],
  controllers: [UserController],
  providers: [UserService, MailService],
})
export class UserModule {}
