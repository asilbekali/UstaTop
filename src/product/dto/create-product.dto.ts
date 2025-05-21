import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Drill Machine',
  })
  name: string;

  @ApiProperty({
    description: 'URL or path of the product image',
    example: 'drill.jpg',
  })
  image: string;

  @ApiProperty({
    description: 'Minimum work hours required',
    example: '2',
  })
  minWorkHour: string;

  @ApiProperty({
    description: 'Skill level of the product',
    example: 'Beginner',
  })
  level: string;

  @ApiProperty({
    description: 'Hourly price for the product',
    example: 50,
  })
  priceHour: number;

  @ApiProperty({
    description: 'Daily price for the product',
    example: 400,
  })
  priceDay: number;

  @ApiProperty({
    description: 'Array of tool IDs required for the product',
    example: [1, 2, 3],
    type: [Number],
  })
  tools: Array<number>;

  @ApiPropertyOptional({
    description: 'Array of master IDs associated with the product (optional)',
    example: [1, 2],
    type: [Number],
  })
  masters?: Array<number>;
}
