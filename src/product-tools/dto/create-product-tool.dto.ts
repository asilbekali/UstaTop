import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductToolDto {
  @ApiProperty({
    description: 'ID of the product',
    example: 1,
  })
  @IsInt({ message: 'Product ID must be an integer' })
  @IsPositive({ message: 'Product ID must be a positive number' })
  productId: number;

  @ApiProperty({
    description: 'ID of the tool',
    example: 2,
  })
  @IsInt({ message: 'Tool ID must be an integer' })
  @IsPositive({ message: 'Tool ID must be a positive number' })
  toolsId: number;
}
