import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Drill Machine',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'Image URL of the product',
    example: 'https://example.com/image.jpg',
  })
  @IsNotEmpty({ message: 'Image URL is required' })
  @IsString({ message: 'Image must be a string' })
  image: string;
}
