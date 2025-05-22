import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateBacketDto {
  @ApiProperty({
    description: 'Order item ID',
    example: 123,
  })
  @IsInt({ message: 'order_iteamId must be an integer' })
  @IsNotEmpty({ message: 'order_iteamId is required' })
  @Min(1, { message: 'order_iteamId must be greater than 0' })
  order_iteamId: number;
}
