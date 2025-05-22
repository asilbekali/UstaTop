import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBacketDto } from './dto/create-backet.dto';
import { UpdateBacketDto } from './dto/update-backet.dto';
import { PrismaService } from 'src/No_Connection_Tables/prisma/prisma.service';
import { measuer } from '@prisma/client';

@Injectable()
export class BacketService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    page = 1,
    limit = 10,
    orderIteamId,
    sortField = 'id',
    sortOrder = 'asc',
  }) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (orderIteamId) {
      where.order_iteam = orderIteamId;
    }

    const totalItems = await this.prisma.backet.count({ where });

    const items = await this.prisma.backet.findMany({
      where,
      include: { order_iteam: true },
      skip,
      take: limit,
      orderBy: {
        [sortField]: sortOrder,
      },
    });

    return {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      items,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} backet`;
  }

  async update(id: number, updateBacketDto: UpdateBacketDto) {
    const existingBacket = await this.prisma.backet.findUnique({
      where: { id },
    });
    if (!existingBacket) {
      throw new NotFoundException(`Backet with id ${id} not found`);
    }

    if (updateBacketDto.order_iteam) {
      const existingOrderItem = await this.prisma.order_iteam.findUnique({
        where: { id: updateBacketDto.order_iteam },
      });
      if (!existingOrderItem) {
        throw new NotFoundException(
          `Order item with id ${updateBacketDto.order_iteam} not found`,
        );
      }
    }

    if (updateBacketDto.productId) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { id: updateBacketDto.productId },
      });
      if (!existingProduct) {
        throw new NotFoundException(
          `Product with id ${updateBacketDto.productId} not found`,
        );
      }
    }

    if (updateBacketDto.levelId) {
      const existingLevel = await this.prisma.level.findUnique({
        where: { id: updateBacketDto.levelId },
      });
      if (!existingLevel) {
        throw new NotFoundException(
          `Level with id ${updateBacketDto.levelId} not found`,
        );
      }
    }

    if (updateBacketDto.tools && updateBacketDto.tools.length > 0) {
      for (const toolId of updateBacketDto.tools) {
        const existingTool = await this.prisma.tools.findUnique({
          where: { id: toolId },
        });
        if (!existingTool) {
          throw new NotFoundException(`Tool with id ${toolId} not found`);
        }
      }
    }

    if (updateBacketDto.measure) {
      const allowedMeasures = Object.values(measuer);
      if (!allowedMeasures.includes(updateBacketDto.measure as measuer)) {
        throw new Error(
          `Measure must be one of: ${allowedMeasures.join(', ')}`,
        );
      }
    }

    if (updateBacketDto.order_iteam) {
      await this.prisma.order_iteam.update({
        where: { id: updateBacketDto.order_iteam },
        data: {
          product: updateBacketDto.productId
            ? { connect: { id: updateBacketDto.productId } }
            : undefined,
          productLevel: updateBacketDto.levelId
            ? { connect: { id: updateBacketDto.levelId } }
            : undefined,
          measuer: updateBacketDto.measure as measuer,
          location: updateBacketDto.location,
          address: updateBacketDto.address,
          data: updateBacketDto.data,
          withDeliver: updateBacketDto.withDeliver,
          count: updateBacketDto.count,
          ...(updateBacketDto.tools && updateBacketDto.tools.length > 0
            ? {
                orderIteamTools: {
                  set: updateBacketDto.tools.map((toolId) => ({ id: toolId })),
                },
              }
            : {}),
        },
      });
    }

    const backetUpdateData: any = {};
    if (updateBacketDto.order_iteam !== undefined) {
      backetUpdateData.order_iteam = updateBacketDto.order_iteam;
    }

    return this.prisma.backet.update({
      where: { id },
      data: backetUpdateData,
    });
  }
  async remove(orderIteamId: number) {
    const orderIteam = await this.prisma.order_iteam.findUnique({
      where: { id: orderIteamId },
    });

    if (!orderIteam) {
      throw new NotFoundException(
        `Order item with id ${orderIteamId} not found`,
      );
    }

    return this.prisma.order_iteam.delete({
      where: { id: orderIteamId },
    });
  }
}
