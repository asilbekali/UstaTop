import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBrendDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({example: "Machita"})
  name: string;
}
