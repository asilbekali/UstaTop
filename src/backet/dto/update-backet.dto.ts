import { PartialType } from '@nestjs/swagger';
import { CreateBacketDto } from './create-backet.dto';

export class UpdateBacketDto extends PartialType(CreateBacketDto) {}
