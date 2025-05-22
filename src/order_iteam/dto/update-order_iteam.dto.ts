import { PartialType } from '@nestjs/swagger';
import { CreateOrderIteamDto } from './create-order_iteam.dto';

export class UpdateOrderIteamDto extends PartialType(CreateOrderIteamDto) {}
