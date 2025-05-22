import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min, Max } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment message',
    example: 'This is a great master!',
  })
  @IsString()
  @IsNotEmpty({ message: 'Message cannot be empty' })
  message: string;

  @ApiProperty({
    description: 'Rating star between 1 and 5',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(6)
  stars: number;

  @ApiProperty({
    description: 'ID of the master',
    example: 123,
  })
  @IsInt()
  masterId: number;
}
