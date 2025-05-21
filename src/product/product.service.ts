import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/No_Connection_Tables/prisma/prisma.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    if (dto.tools && dto.tools.length > 0) {
      for (const toolId of dto.tools) {
        const toolExists = await this.prisma.tools.findUnique({
          where: { id: toolId },
        });
        if (!toolExists) {
          throw new NotFoundException(`Tool with ID ${toolId} not found`);
        }
      }
    }

    if (dto.masters && dto.masters.length > 0) {
      for (const masterId of dto.masters) {
        const masterExists = await this.prisma.master.findUnique({
          where: { id: masterId },
        });
        if (!masterExists) {
          throw new NotFoundException(`Master with ID ${masterId} not found`);
        }
      }
    }

    return this.prisma.product.create({
      data: {
        name: dto.name,
        image: dto.image || 'default-image-url.jpg',
        minWorkHour: parseInt(dto.minWorkHour),
        priceHour: dto.priceHour,
        priceDay: dto.priceDay,
        isActive: true,
        tools: dto.tools
          ? {
              connect: dto.tools.map((id) => ({ id })),
            }
          : undefined,
        masters: dto.masters
          ? {
              connect: dto.masters.map((id) => ({ id })),
            }
          : undefined,
      },
    });
  }

  async findAll({
    page = 1,
    limit = 10,
    name,
  }: {
    page?: number;
    limit?: number;
    name?: string;
  }) {
    const skip = (page - 1) * limit;
    const filters: any = {};

    if (name) {
      filters.name = { contains: name };
    }

    return this.prisma.product.findMany({
      where: filters,
      skip,
      take: limit,
      include: { masters: true, tools: true },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst({
      where: { id },
      include: { masters: true, tools: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found!');
    }

    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      throw new NotFoundException('Product not found!');
    }

    if (dto.tools) {
      for (const toolId of dto.tools) {
        const toolExists = await this.prisma.tools.findUnique({
          where: { id: toolId },
        });
        if (!toolExists) {
          throw new NotFoundException(`Tool with ID ${toolId} not found`);
        }
      }
    }

    if (dto.masters) {
      for (const masterId of dto.masters) {
        const masterExists = await this.prisma.master.findUnique({
          where: { id: masterId },
        });
        if (!masterExists) {
          throw new NotFoundException(`Master with ID ${masterId} not found`);
        }
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name || existingProduct.name,
        image: dto.image || existingProduct.image,
        minWorkHour: dto.minWorkHour
          ? parseInt(dto.minWorkHour)
          : existingProduct.minWorkHour,
        priceHour: dto.priceHour || existingProduct.priceHour,
        priceDay: dto.priceDay || existingProduct.priceDay,
        tools: dto.tools
          ? {
              set: dto.tools.map((toolId) => ({ id: toolId })),
            }
          : undefined,
        masters: dto.masters
          ? {
              set: dto.masters.map((masterId) => ({ id: masterId })),
            }
          : undefined,
      },
    });
  }

  async remove(id: number) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found!');
    }

    await this.prisma.product.delete({ where: { id } });

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }
}
