import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateGeneralDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString({ message: 'Links must be a string' })
  @IsOptional()
  links: string;

  @Matches(/^\+998\d{9}$/, {
    message:
      'Phone number must be a valid Uzbekistan number starting with +998 followed by 9 digits',
  })
  phone: string;

  @IsString({ message: 'Admin Telegram username must be a string' })
  @IsNotEmpty({ message: 'Admin Telegram username is required' })
  adminTg: string;
}
