import { ApiProperty } from '@nestjs/swagger';
import { region, role } from '@prisma/client';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  Length,
  Matches,
  IsNumber,
  isString,
  isNotEmpty,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 50)
  full_name: string;

  @IsString()
  password: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  type: string;

  @IsNumber()
  region: number;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  bank?: string;

  @IsOptional()
  @IsString()
  @Length(5, 100)
  address?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, { message: 'OKEND must be numeric' })
  okend?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, { message: 'INN must be numeric' })
  inn?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, { message: 'PC must be numeric' })
  pc?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, { message: 'MFO must be numeric' })
  mfo?: string;

  @IsEnum(role, { message: 'Invalid role provided' })
  role: role;
}
