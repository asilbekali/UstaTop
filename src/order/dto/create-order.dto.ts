import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'User basket ID',
    example: 123,
  })
  @IsInt({ message: 'backetId must be an integer' })
  @IsNotEmpty({ message: 'backetId should not be empty' })
  @Min(1, { message: 'backetId must be greater than zero' })
  backetId: number;

  @IsBoolean()
  @ApiProperty({
    description: 'Do you pay on order or pay later yes or no ?',
    example: false,
  })
  pay?: string;
}
