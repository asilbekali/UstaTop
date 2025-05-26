import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/No_Connection_Tables/prisma/prisma.service';
import { status } from '@prisma/client';
import { TgService } from 'src/tg/tg.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tg: TgService,
  ) {}

  async payOrder(req: Request, orderId: number) {
    const userId = await req['user'].id;
    const bazaOrder = await this.prisma.order.findFirst({
      where: { id: Number(orderId), pay: status.pending },
    });

    if (!bazaOrder) {
      throw new BadRequestException('Order not found !');
    }

    await this.prisma.order.update({
      where: { id: Number(orderId) },
      data: {
        pay: status.payed,
      },
    });

    return { message: 'You payed order thank you :)' };
  }

  async payment(req: Request, status: 'payed' | 'pending') {
    const userId = req['user'].id;

    const orders = await this.prisma.order.findMany({
      where: {
        userId,
        pay: status,
      },
      include: {
        backet: {
          include: {
            order_iteam: true,
          },
        },
      },
    });

    let totalSum = 0;

    for (const order of orders) {
      console.log(`Order ID: ${order.id}`);

      if (order.backet && order.backet.order_iteam) {
        for (const item of order.backet.order_iteam) {
          const masterProduct = await this.prisma.masterProduct.findFirst({
            where: {
              id: item.productId,
              levelId: item.levelId,
            },
          });

          if (!masterProduct) {
            console.log(
              `Master product not found for productId: ${item.productId}, levelId: ${item.levelId}`,
            );
            continue;
          }

          let measureValue = 0;
          if (item.measuer === 'day') {
            measureValue = masterProduct.priceDay;
          } else if (item.measuer === 'hour') {
            measureValue = masterProduct.priceHour;
          } else {
            console.log(
              `Unknown measure: ${item.measuer} for productId: ${item.productId}`,
            );
            continue;
          }

          const quantity = item.count ?? 1;

          const itemSum = measureValue * quantity;
          totalSum += itemSum;

          console.log(
            `Product ID: ${item.productId}, Level ID: ${item.levelId}, Measure: ${item.measuer}, Measure Value: ${measureValue}, Quantity: ${quantity}, Item Sum: ${itemSum}`,
          );
        }
      }
    }

    console.log(`Total sum for all order items: ${totalSum}`);

    return {
      orders,
      totalSum,
    };
  }

  async create(dto: CreateOrderDto, req: Request) {
    const bazaBacket = await this.prisma.backet.findFirst({
      where: { id: dto.backetId },
    });

    if (!bazaBacket) {
      throw new BadRequestException('Backet not found');
    }

    const payStatus = dto.pay ? status.payed : status.pending;

    const createdOrder = await this.prisma.order.create({
      data: {
        backetId: dto.backetId,
        userId: req['user'].id,
        pay: payStatus,
      },
    });

    await this.prisma.order_iteam.updateMany({
      where: {
        backetId: dto.backetId,
      },
      data: {
        status: false,
      },
    });

    await this.tg.sendMessageToAdmin(
      'Created new order please show web site !',
    );

    console.log("message send");
    

    return createdOrder;
  }

  async findAll(paginationOptions: {
    page: number;
    limit: number;
    orderId?: number;
  }) {
    const { page, limit, orderId } = paginationOptions;
    const skip = (page - 1) * limit;

    const filters = orderId ? { id: orderId } : {};

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: filters,
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where: filters }),
    ]);

    return {
      data: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const bazaOrder = await this.prisma.order.findFirst({ where: { id } });

    if (!bazaOrder) {
      throw new BadRequestException('Order not found');
    }

    return bazaOrder;
  }

  async remove(id: number, req: Request) {
    const userId = req['user'].id;

    const existingOrder = await this.prisma.order.findFirst({
      where: { id, userId },
    });

    if (!existingOrder) {
      throw new BadRequestException(
        'Order not found or you are not authorized to delete this order',
      );
    }

    return this.prisma.order.delete({ where: { id } });
  }

  async orderAcceptance(order_id: number) {
    const bazaOrder = await this.prisma.order.findFirst({
      where: { id: order_id },
      include: {
        backet: {
          include: {
            order_iteam: true,
          },
        },
      },
    });

    if (!bazaOrder || !bazaOrder.backet || !bazaOrder.backet.order_iteam) {
      throw new BadRequestException('Order not found or no items in the order');
    }

    for (const item of bazaOrder.backet.order_iteam) {
      const masterProduct = await this.prisma.masterProduct.findFirst({
        where: {
          id: item.productId,
          levelId: item.levelId,
        },
      });

      if (!masterProduct) {
        console.log(
          `Master product not found for productId: ${item.productId}, levelId: ${item.levelId}`,
        );
        continue;
      }

      const master = await this.prisma.master.findFirst({
        where: { id: masterProduct.masterId },
      });

      if (!master) {
        console.log(`Master not found for masterId: ${masterProduct.masterId}`);
        continue;
      }

      await this.prisma.master.update({
        where: { id: master.id },
        data: { isWork: true },
      });

      console.log(
        `Master updated: Master ID: ${master.id}, isWork set to true`,
      );
    }

    return {
      message: 'Order accepted and master records updated successfully.',
    };
  }
}
