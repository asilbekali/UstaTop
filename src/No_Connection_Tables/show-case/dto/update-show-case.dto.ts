import { PartialType } from '@nestjs/swagger';
import { CreateShowCaseDto } from './create-show-case.dto';

export class UpdateShowCaseDto extends PartialType(CreateShowCaseDto) {}
