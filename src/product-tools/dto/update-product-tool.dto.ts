import { PartialType } from '@nestjs/swagger';
import { CreateProductToolDto } from './create-product-tool.dto';

export class UpdateProductToolDto extends PartialType(CreateProductToolDto) {}
