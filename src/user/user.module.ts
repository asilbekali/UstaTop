import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: 'ustatop',
      signOptions: { expiresIn: '1h' },
      global: true,
    }),
  ],
  controllers: [UserController],
  providers: [UserService, MailService],
})
export class UserModule {}
