import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateSuggestionDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Surname is required' })
  @Length(2, 50, { message: 'Surname must be between 2 and 50 characters' })
  surName: string;

  @IsString()
  @IsNotEmpty({ message: 'Message is required' })
  @Length(10, 500, { message: 'Message must be between 10 and 500 characters' })
  message: string;
}
