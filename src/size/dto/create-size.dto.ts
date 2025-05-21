import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSizeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Large', description: 'Name of the size' })
  name: string;
}
