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
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from 'src/No_Connection_Tables/Guards/auth.guard';
import { ApiQuery } from '@nestjs/swagger';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Get('Pay-orders')
  @ApiQuery({
    name: 'orderId',
    type: Number,
    required: true,
    description: 'ID of the order',
  })
  payOrder(@Req() req: Request, @Query('orderId') orderId: number) {
    return this.orderService.payOrder(req, orderId);
  }

  @Get('show')
  @UseGuards(AuthGuard)
  @ApiQuery({
    name: 'status',
    required: true,
    description: 'Filter orders by status',
    enum: ['payed', 'pending'],
  })
  async pay(@Query('status') status: 'payed' | 'pending', @Req() req: Request) {
    console.log('Status from query:', status);
    return this.orderService.payment(req, status);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return this.orderService.create(createOrderDto, req);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'orderId', required: false })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('orderId') orderId?: string,
  ) {
    const paginationOptions = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      orderId: orderId ? parseInt(orderId, 10) : undefined,
    };

    return this.orderService.findAll(paginationOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.orderService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: Request) {
    return this.orderService.remove(+id, req);
  }
}
