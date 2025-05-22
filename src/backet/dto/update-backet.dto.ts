import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBacketDto {
  @ApiPropertyOptional({ example: 5, description: 'Order item ID' })
  order_iteam?: number;

  @ApiPropertyOptional({ example: 10, description: 'Product ID' })
  productId?: number;

  @ApiPropertyOptional({ example: 2, description: 'Level ID' })
  levelId?: number;

  @ApiPropertyOptional({ example: 'day', description: 'Measure unit (Enum)' })
  measure?: string;

  @ApiPropertyOptional({ example: 'Tashkent', description: 'Location name' })
  location?: string;

  @ApiPropertyOptional({
    example: 'Street 123, Apt 45',
    description: 'Address details',
  })
  address?: string;

  @ApiPropertyOptional({
    example: '2025-05-22T00:00:00.000Z',
    description: 'Date or some other data',
  })
  data?: string;

  @ApiPropertyOptional({ example: true, description: 'With delivery or not' })
  withDeliver?: boolean;

  @ApiPropertyOptional({ example: 3, description: 'Count of items' })
  count?: number;

  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: 'Array of tool IDs',
    type: [Number],
  })
  tools?: number[];
}
