import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min } from 'class-validator';

export class CreateProductLevelDto {
  @ApiProperty({
    description: 'The ID of the product',
    example: 1,
  })
  @IsInt({ message: 'Product ID must be an integer.' })
  @IsPositive({ message: 'Product ID must be a positive number.' })
  productId: number;

  @ApiProperty({
    description: 'The ID of the level',
    example: 2,
  })
  @IsInt({ message: 'Level ID must be an integer.' })
  @IsPositive({ message: 'Level ID must be a positive number.' })
  levelId: number;

  @ApiProperty({
    description: 'The minimum working hours required',
    example: 3,
  })
  @IsInt({ message: 'Min Work Hour must be an integer.' })
  @Min(1, { message: 'Min Work Hour must be at least 1.' })
  minWorkHour: number;

  @ApiProperty({
    description: 'Price per day for the product',
    example: 50,
  })
  @IsInt({ message: 'Price Day must be an integer.' })
  @Min(0, { message: 'Price Day cannot be negative.' })
  priceDay: number;

  @ApiProperty({
    description: 'Price per hour for the product',
    example: 10,
  })
  @IsInt({ message: 'Price Hour must be an integer.' })
  @Min(0, { message: 'Price Hour cannot be negative.' })
  priceHour: number;
}
