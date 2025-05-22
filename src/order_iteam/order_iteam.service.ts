import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/No_Connection_Tables/prisma/prisma.service';
import { CreateOrderIteamDto } from './dto/create-order_iteam.dto';
import { UpdateOrderIteamDto } from './dto/update-order_iteam.dto';
import { measuer } from '@prisma/client';

@Injectable()
export class OrderIteamService {
  constructor(private readonly prisma: PrismaService) {}

  async validateProductAndLevel(productId: number, levelId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new BadRequestException(`Product with ID ${productId} not found.`);
    }

    const level = await this.prisma.level.findUnique({
      where: { id: levelId },
    });
    if (!level) {
      throw new BadRequestException(`Level with ID ${levelId} not found.`);
    }

    const productLevel = await this.prisma.productLevel.findFirst({
      where: { productId, levelId },
    });
    if (!productLevel) {
      throw new BadRequestException(
        `Product with ID ${productId} is not associated with Level ID ${levelId}.`,
      );
    }
  }

  async validateOrderIteam(id: number) {
    const orderIteam = await this.prisma.order_iteam.findUnique({
      where: { id },
      include: { orderIteamTools: true },
    });
    if (!orderIteam) {
      throw new NotFoundException(`Order item with ID ${id} not found.`);
    }
    return orderIteam;
  }

  async create(dto: CreateOrderIteamDto, req: Request) {
    let userbacket = await this.prisma.backet.findFirst({
      where: { userId: req['user'].id },
    });

    if (!userbacket) {
      userbacket = await this.prisma.backet.create({
        data: { userId: req['user'].id },
      });
    }

    await this.validateProductAndLevel(dto.productId, dto.levelId);

    if (dto.tools && dto.tools.length > 0) {
      const toolsExist = await this.prisma.tools.findMany({
        where: { id: { in: dto.tools } },
      });

      if (toolsExist.length !== dto.tools.length) {
        throw new BadRequestException('Some tools IDs do not exist');
      }
    }

    if (dto.measuer == measuer.day || dto.measuer == measuer.hour) {
      const orderIteam = await this.prisma.order_iteam.create({
        data: {
          productId: dto.productId,
          levelId: dto.levelId,
          measuer: dto.measuer,
          location: dto.location,
          address: dto.address,
          data: dto.data,
          withDeliver: dto.withDeliver,
          count: dto.count,
          status: true,
          user_Id: req['user'].id,
          backetId: userbacket.id,
        },
      });

      if (dto.tools && dto.tools.length > 0) {
        await this.prisma.orderIteamTools.createMany({
          data: dto.tools.map((toolId) => ({
            order_iteamId: orderIteam.id,
            toolsId: toolId,
          })),
        });
      }

      return orderIteam;
    } else {
      throw new BadRequestException('Measure must be day or hour!');
    }
  }

  async findAll(query: {
    page: number;
    limit: number;
    location?: string;
    address?: string;
  }) {
    const { page, limit, location, address } = query;
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (location)
      filters.location = { contains: location, mode: 'insensitive' };
    if (address) filters.address = { contains: address, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.order_iteam.findMany({
        where: filters,
        skip,
        take: limit,
        include: { orderIteamTools: true },
      }),
      this.prisma.order_iteam.count({ where: filters }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    return this.validateOrderIteam(id);
  }

  async update(id: number, updateOrderIteamDto: UpdateOrderIteamDto) {
    await this.validateOrderIteam(id);

    if (
      updateOrderIteamDto.productId !== undefined &&
      updateOrderIteamDto.levelId !== undefined
    ) {
      await this.validateProductAndLevel(
        updateOrderIteamDto.productId,
        updateOrderIteamDto.levelId,
      );
    }

    const updatedOrderIteam = await this.prisma.order_iteam.update({
      where: { id },
      data: {
        ...updateOrderIteamDto,
      },
    });

    if (updateOrderIteamDto.tools && updateOrderIteamDto.tools.length > 0) {
      await this.prisma.orderIteamTools.deleteMany({
        where: { order_iteamId: id },
      });
      await this.prisma.orderIteamTools.createMany({
        data: updateOrderIteamDto.tools.map((toolId) => ({
          order_iteamId: id,
          toolsId: toolId,
        })),
      });
    }

    return updatedOrderIteam;
  }

  async remove(id: number) {
    await this.validateOrderIteam(id);
    await this.prisma.orderIteamTools.deleteMany({
      where: { order_iteamId: id },
    });

    return this.prisma.order_iteam.delete({ where: { id } });
  }
}
