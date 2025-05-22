import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderIteamDto } from './dto/create-order_iteam.dto';
import { UpdateOrderIteamDto } from './dto/update-order_iteam.dto';
import { OrderIteamService } from './order_iteam.service';
import { ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/No_Connection_Tables/Guards/auth.guard';

@Controller('order-iteam')
export class OrderIteamController {
  constructor(private readonly orderIteamService: OrderIteamService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createOrderIteamDto: CreateOrderIteamDto,
    @Req() req: Request,
  ) {
    return this.orderIteamService.create(createOrderIteamDto, req);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'address', required: false, type: String })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('location') location?: string,
    @Query('address') address?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.orderIteamService.findAll({
      page: pageNumber,
      limit: limitNumber,
      location,
      address,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.orderIteamService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateOrderIteamDto: UpdateOrderIteamDto,
  ) {
    return this.orderIteamService.update(+id, updateOrderIteamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.orderIteamService.remove(+id);
  }
}
