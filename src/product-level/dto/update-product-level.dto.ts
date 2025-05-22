import { PartialType } from '@nestjs/swagger';
import { CreateProductLevelDto } from './create-product-level.dto';

export class UpdateProductLevelDto extends PartialType(CreateProductLevelDto) {}
