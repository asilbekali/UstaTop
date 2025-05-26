import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserStatus, UserType } from '@prisma/client';
import { authenticator } from 'otplib';
import { JwtService } from '@nestjs/jwt';
const DeviceDetector = require('device-detector-js');
import { Request } from 'express';
import { name } from 'ejs';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: MailService,
    private readonly jwt: JwtService,
  ) {}

  private otpStore = new Map<string, { otp: string; expiresAt: number }>();

  async myProfileService(req: Request) {
    const bazaUser = await this.prisma.user.findFirst({
      where: { id: req['user'].id },
    });

    return bazaUser;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('Invalid ID provided');
    }

    const bazaUser = await this.prisma.user.findFirst({ where: { id: id } });

    if (!bazaUser) {
      throw new NotFoundException('User not found');
    }

    return bazaUser;
  }

  async update(id: number, upDto: UpdateUserDto) {
    const bazaUser = await this.prisma.user.findFirst({ where: { id: id } });
    if (!bazaUser) {
      throw new NotFoundException('User not found');
    }

    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('Invalid ID provided');
    }

    const updateUser = await this.prisma.user.update({
      where: { id: id },
      data: {
        full_name: upDto.full_name,
      },
    });

    return updateUser;
  }

  async remove(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('Invalid ID provided');
    }

    const bazaUser = await this.prisma.user.findFirst({ where: { id: id } });
    if (!bazaUser) {
      throw new NotFoundException('User not found');
    }

    return { deletedPro: await this.prisma.user.delete({ where: { id: id } }) };
  }

  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async register(dto: CreateUserDto) {
    const bazaUser = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (bazaUser) {
      throw new BadRequestException(
        'This user already exists, try another email account!',
      );
    }

    const bazaRegion = await this.prisma.region.findUnique({
      where: { id: dto.region },
    });

    if (!bazaRegion) {
      throw new BadRequestException('Register from an unavailable region!');
    }

    const hash = await bcrypt.hash(dto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        full_name: dto.full_name,
        password: hash,
        email: dto.email,
        regionId: dto.region,
        type: dto.type as UserType,
        bank: dto.bank,
        address: dto.address,
        okend: dto.okend,
        inn: dto.inn,
        pc: dto.pc,
        mfo: dto.mfo,
        role: dto.role,
        status: UserStatus.noActive,
      },
    });

    authenticator.options = { step: 1200 };
    const secret = authenticator.generateSecret();
    const otp = authenticator.generate(secret);

    console.log(otp);

    await this.mailer.sendEmail(newUser.email, 'Your OTP password', otp);

    this.otpStore.set(newUser.email, {
      otp,
      expiresAt: Date.now() + 1200000, // 20 minut
    });

    return {
      message: `One Time password sent to your ${newUser.email} email address, our new user ${newUser.full_name}`,
    };
  }

  async verify(email: string, otpBody: string) {
    const bazaUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!bazaUser) {
      throw new BadRequestException('User not found');
    }

    const otpBaza = this.otpStore.get(email);

    if (otpBaza && otpBaza.otp === otpBody && otpBaza.expiresAt > Date.now()) {
      const updatedUser = await this.prisma.user.update({
        where: { email },
        data: { status: UserStatus.active },
      });

      this.otpStore.delete(email);

      return { message: `Your account is now ${updatedUser.status}` };
    } else {
      throw new BadRequestException('OTP is invalid or expired');
    }
  }

  async login(password: string, email: string, req: any) {
    this.logDeviceInfo(req);
    const bazaUser = await this.prisma.user.findFirst({
      where: { email: email },
    });

    if (!bazaUser) {
      throw new BadRequestException('User not found');
    }

    if (bazaUser.status === UserStatus.noActive) {
      throw new BadRequestException('First you must verify your account!');
    }

    const match = await bcrypt.compare(password, bazaUser.password);

    if (!match) {
      throw new BadRequestException('Wrong password');
    }

    const accessToken = this.getAccessToken(bazaUser);
    const refreshToken = this.generateRefreshToken(bazaUser);

    return { AccessToken: accessToken, RefreshToken: refreshToken };
  }

  getAccessToken(bazaUser: any) {
    try {
      const token = this.jwt.sign(
        {
          id: bazaUser.id,
          full_name: bazaUser.full_name,
          role: bazaUser.role,
          email: bazaUser.email,
          status: bazaUser.status,
        },
        { expiresIn: '1h' },
      );

      return token;
    } catch (error) {
      throw new BadRequestException('Error in generating access token');
    }
  }

  generateRefreshToken(bazaUser: any) {
    try {
      const token = this.jwt.sign(
        {
          id: bazaUser.id,
          full_name: bazaUser.full_name,
          role: bazaUser.role,
          email: bazaUser.email,
          status: bazaUser.status,
        },
        { expiresIn: '7d' },
      );

      return token;
    } catch (error) {
      throw new BadRequestException('Error in generating refresh token');
    }
  }

  async resentOtp(email: string) {
    authenticator.options = { step: 1200 };
    const secret = authenticator.generateSecret();
    const otp = authenticator.generate(secret);

    await this.mailer.sendEmail(email, 'Your OTP password', otp);

    this.otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 1200000,
    });

    console.log(otp);

    return { message: 'Otp send your accaunt' };
  }

  async resentAccestocen(password: string, email: string) {
    const bazaUser = await this.prisma.user.findFirst({
      where: { email: email },
    });
    if (!bazaUser) {
      throw new BadRequestException('User not found !');
    }
    return { AccestToken: this.getAccessToken(bazaUser) };
  }

  async logDeviceInfo(req: any) {
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
      req.socket.remoteAddress ||
      'Unknown IP';

    const userAgent = req.headers['user-agent'] || '';

    const deviceDetector = new DeviceDetector();
    const device = deviceDetector.parse(userAgent.toString());

    const deviceName =
      device.device?.type || device.client?.name || 'Unknown device';

    const bazaSession = await this.prisma.my_sessions.findFirst({
      where: { deviceIP: ip },
    });

    if (bazaSession) {
      return bazaSession;
    }

    const newSession = await this.prisma.my_sessions.create({
      data: {
        deviceIP: ip,
        deviceName: deviceName,
      },
    });

    return newSession;
  }
}
