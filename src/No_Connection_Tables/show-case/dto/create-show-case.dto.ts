import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class CreateShowCaseDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @MinLength(5, { message: 'Description must be at least 5 characters' })
  @MaxLength(500, { message: 'Description must be at most 500 characters' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Image URL is required' })
  @IsUrl({}, { message: 'Image must be a valid URL' })
  image: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'Link must be a valid URL' })
  link: string;
}
