import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNumber,
  IsArray,
  IsNotEmpty,
  Min,
  Max,
  ArrayMinSize,
  IsObject,
} from 'class-validator';

export class CreateMasterDto {
  @ApiProperty({ description: 'Full name of the master', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    description: 'Email address of the master',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Year of experience', example: 2025 })
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  year: number;

  @ApiProperty({ description: 'Hourly price', example: 50 })
  @IsNumber()
  @Min(1)
  priceHour: number;

  @ApiProperty({ description: 'Daily price', example: 400 })
  @IsNumber()
  @Min(1)
  priceDay: number;

  @ApiProperty({ description: 'Years of experience', example: 5 })
  @IsNumber()
  @Min(0)
  exprience: number;

  @ApiProperty({
    description: 'List of tools IDs used by the master',
    example: [1, 2, 3],
  })
  @IsArray()
  @ArrayMinSize(1)
  tools: Array<number>;

  @ApiProperty({
    description: 'Image URL',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    description: 'Passport image URL',
    example: 'https://example.com/passport.jpg',
  })
  @IsString()
  @IsNotEmpty()
  passpoerImage: string;

  @ApiProperty({
    description: 'Short description about the master',
    example: 'Highly skilled in carpentry and woodworking',
  })
  @IsString()
  @IsNotEmpty()
  about: string;

  @ApiProperty({
    description: 'Jobs associated with the master',
    example: [
      { productId: 1, levelId: 2 },
      { productId: 3, levelId: 4 },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsObject({ each: true })
  jobs: Array<{ productId: number; levelId: number }>;
}






// adawd