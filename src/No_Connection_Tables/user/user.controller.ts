import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { AuthGuard } from '../Guards/auth.guard';
import { RoleDec } from './decorator/roles.decorator';
import { Role } from './enum/role.enum';
import { RolesGuard } from '../Guards/roles.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('add-admin')
  @ApiOperation({
    summary: 'Assign a role to a user',
    description:
      'Assign a specific role to a user by providing userId and role.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'number',
          example: 1,
          description: 'The ID of the user to be assigned the role.',
        },
        role: {
          type: 'string',
          example: 'admin',
          description:
            'The role to be assigned. Must be one of: admin, super_admin, viwer_admin, user_fiz, user_yur.',
        },
      },
      required: ['userId', 'role'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Role assigned successfully.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        role: { type: 'string', example: 'admin' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid role provided or missing required fields.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async addAdmin(@Body() body: { userId: number; role: string }) {
    const { userId, role } = body;

    const allowedRoles = [
      'admin',
      'super_admin',
      'viwer_admin',
      'user_fiz',
      'user_yur',
    ];

    if (!allowedRoles.includes(role)) {
      throw new BadRequestException(
        `Invalid role provided. Allowed roles: ${allowedRoles.join(', ')}`,
      );
    }

    const userExists = await this.userService.findOne(userId);
    if (!userExists) {
      throw new BadRequestException('User not found.');
    }
  
    return this.userService.addAdminService(userId, role);
  }

  @Get('mySession')
  async session(@Req() req: Request) {
    return this.userService.logDeviceInfo(req);
  }

  @UseGuards(AuthGuard)
  @Get('my-profile')
  async myProfile(@Req() req: Request) {
    return this.userService.myProfileService(req);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Sample user registration',
        value: {
          full_name: 'John Doe',
          email: 'asilbeknt7@gmail.com',
          password: 'password123',
          type: 'yuridik', 
          region: 3,
          bank: 'Some Bank',
          address: '123 Main St',
          pc: '123456',
          inn: '987654321',
          mfo: '123456',
          okend: '123456', 
          role: 'user_yur', 
        },
      },
    },
  })
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify user OTP' })
  @ApiResponse({ status: 200, description: 'User successfully verified.' })
  @ApiBody({
    schema: {
      properties: {
        otp: { type: 'string', example: '123456' },
        email: { type: 'string', example: 'asilbeknt7@gmail.com' },
      },
    },
  })
  verify(@Body('otp') otp: string, @Body('email') email: string) {
    return this.userService.verify(email, otp);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiBody({
    schema: {
      properties: {
        password: { type: 'string', example: 'password123' },
        email: { type: 'string', example: 'asilbeknt7@gmail.com' },
      },
    },
  })
  login(
    @Body('password') password: string,
    @Body('email') email: string,
    @Req() req: Request,
  ) {
    return this.userService.login(password, email, req);
  }

  @RoleDec(Role.ADMIN, Role.VIWER_ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'All users retrieved successfully.',
    schema: {
      example: [
        {
          id: 1,
          full_name: 'John Doe',
          email: 'johndoe@example.com',
          region: 3,
          bank: 'Some Bank',
          address: '123 Main St',
          pc: '123456',
          inn: '987654321',
          mfo: '123456',
          okend: '123456',
          role: 'user',
        },
      ],
    },
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
    schema: {
      example: {
        id: 1,
        full_name: 'John Doe',
        email: 'johndoe@example.com',
        region: 3,
        bank: 'Some Bank',
        address: '123 Main St',
        pc: '123456',
        inn: '987654321',
        mfo: '123456',
        okend: '123456',
        role: 'user',
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiBody({ schema: { example: { full_name: 'Alibek' } } })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    schema: {
      example: {
        id: 1,
        full_name: 'John Doe Updated',
      },
    },
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
    schema: {
      example: {
        message: 'User with ID 1 has been deleted successfully.',
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('resent-otp')
  @ApiOperation({ summary: 'Resend OTP to user email' })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string', example: 'asilbeknt7@gmail.com' },
      },
      required: ['email'],
    },
  })
  @ApiResponse({ status: 201, description: 'OTP resent successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request or user not found.' })
  async resentOtp(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    return this.userService.resentOtp(email);
  }

  @Post('resent-access-token')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'asilbeknt7@gmail.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiBadRequestResponse({
    description: 'User not found or invalid credentials',
  })
  async resentAccessToken(
    @Body('password') password: string,
    @Body('email') email: string,
  ) {
    return this.userService.getAccessToken(password);
  }
}
