import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { measuer } from '@prisma/client';

export class CreateOrderIteamDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  @IsInt()
  productId: number;

  @ApiProperty({ example: 1, description: 'Level ID' })
  @IsInt()
  levelId: number;

  @ApiProperty({
    example: 'day',
    enum: measuer,
    description: 'Measurement unit',
  })
  @IsNotEmpty()
  measuer: measuer;

  @ApiProperty({ example: 'Tashkent', description: 'Location' })
  @IsString()
  location: string;

  @ApiProperty({ example: 'Some address', description: 'Address' })
  @IsString()
  address: string;

  @ApiProperty({ example: '2025-05-22T00:00:00.000Z', description: 'Date' })
  @IsDateString()
  data: Date;

  @ApiProperty({ example: true, description: 'With delivery or not' })
  @IsBoolean()
  withDeliver: boolean;

  @ApiProperty({
    example: [1, 2],
    description: 'Optional tools IDs',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tools?: number[];

  @ApiProperty({ example: 5, description: 'Count' })
  @IsInt()
  count: number;
}
