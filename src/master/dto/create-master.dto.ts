import {
  IsString,
  IsEmail,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class JobDetailDto {
  @ApiPropertyOptional({ example: 1, description: 'Profession ID' })
  @IsOptional()
  @IsNumber()
  prof_id: number;

  @ApiPropertyOptional({ example: 2, description: 'Level ID' })
  @IsOptional()
  @IsNumber()
  level_id: number;

  @ApiPropertyOptional({
    example: 40,
    description: 'Minimum work hours per week',
  })
  @IsOptional()
  @IsNumber()
  minworkhour: number;

  @ApiPropertyOptional({ example: 100, description: 'Price per day' })
  @IsOptional()
  @IsNumber()
  price_day: number;

  @ApiPropertyOptional({ example: 15, description: 'Price per hour' })
  @IsOptional()
  @IsNumber()
  price_hour: number;

  @ApiPropertyOptional({ example: 5, description: 'Years of experience' })
  @IsOptional()
  @IsNumber()
  experince: number;
}

export class CreateMasterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  full_name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 1985 })
  @IsNumber()
  year: number;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsString()
  image: string;

  @ApiProperty({ example: 'https://example.com/passport.jpg' })
  @IsString()
  passpoerImage: string;

  @ApiProperty({ example: 'Experienced professional in...' })
  @IsString()
  about: string;

  @ApiProperty({
    type: [JobDetailDto],
    example: [
      {
        prof_id: 1,
        level_id: 2,
        minworkhour: 40,
        price_day: 100,
        price_hour: 15,
        experince: 5,
      },
      {
        prof_id: 3,
        level_id: 1,
        minworkhour: 20,
        price_day: 80,
        price_hour: 12,
        experince: 3,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JobDetailDto)
  jobs: JobDetailDto[];
}
