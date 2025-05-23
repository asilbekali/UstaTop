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
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { RoleDec } from 'src/No_Connection_Tables/user/decorator/roles.decorator';
import { Role } from 'src/No_Connection_Tables/user/enum/role.enum';
import { RolesGuard } from 'src/No_Connection_Tables/Guards/roles.guard';

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

  @RoleDec(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post('orderAcceptance')
  @ApiOperation({
    summary: 'Accept an order and update related master records',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        order_id: {
          type: 'number',
          example: 123,
          description: 'The ID of the order to be accepted',
        },
      },
      required: ['order_id'],
    },
  })
  @ApiResponse({ status: 200, description: 'Order accepted successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Order not found or no items in the order.',
  })
  orderAcceptance(@Body() body: { order_id: number }) {
    const { order_id } = body;
    return this.orderService.orderAcceptance(order_id);
  }
}
