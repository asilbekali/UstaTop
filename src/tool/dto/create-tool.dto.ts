import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateToolDto {
  @ApiProperty({
    example: 'Hammer',
    description: 'The name of the tool',
  })
  @IsNotEmpty({ message: 'Tool name must not be empty' })
  @IsString({ message: 'Tool name must be a string' })
  name: string;

  @ApiProperty({
    example: 25.99,
    description: 'The price of the tool',
  })
  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be greater than 0' })
  price: number;

  @ApiProperty({
    example: 10,
    description: 'The count of tools available in stock',
  })
  @IsNotEmpty({ message: 'Count is required' })
  @IsNumber({}, { message: 'Count must be a number' })
  @Min(1, { message: 'Count must be at least 1' })
  count: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the capacity',
  })
  @IsNotEmpty({ message: 'Capacity ID is required' })
  @IsNumber({}, { message: 'Capacity ID must be a number' })
  @IsPositive({ message: 'Capacity ID must be greater than 0' })
  capasityId: number;

  @ApiProperty({
    example: 2,
    description: 'The ID of the size',
  })
  @IsNotEmpty({ message: 'Size ID is required' })
  @IsNumber({}, { message: 'Size ID must be a number' })
  @IsPositive({ message: 'Size ID must be greater than 0' })
  sizeId: number;

  @ApiProperty({
    example: 3,
    description: 'The ID of the brand',
  })
  @IsNotEmpty({ message: 'Brand ID is required' })
  @IsNumber({}, { message: 'Brand ID must be a number' })
  @IsPositive({ message: 'Brand ID must be greater than 0' })
  brendId: number;

  @ApiProperty({ example: 'picture.png' })
  @IsString()
  image: string;
}
