import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductLevelDto } from './dto/create-product-level.dto';
import { UpdateProductLevelDto } from './dto/update-product-level.dto';
import { PrismaService } from 'src/No_Connection_Tables/prisma/prisma.service';
@Injectable()
export class ProductLevelService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateProductLevelDto) {
    const bazaPro = await this.prisma.product.findFirst({
      where: { id: dto.productId },
    });

    const bazaLevel = await this.prisma.level.findFirst({
      where: { id: dto.levelId },
    });

    if (!bazaPro) {
      throw new BadRequestException('Profession not found !');
    }

    if (!bazaLevel) {
      throw new BadRequestException('Level not found !');
    }

    const newProLevel = await this.prisma.productLevel.create({ data: dto });
    return newProLevel;
  }

  async findAll(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = query;

    const skip = (page - 1) * limit;
    const take = Number(limit);

    const [data, total] = await Promise.all([
      this.prisma.productLevel.findMany({
        skip,
        take,
        include: { product: true, level: true },
      }),
      this.prisma.productLevel.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const bazaProLevel = await this.prisma.productLevel.findFirst({
      where: { id: Number(id) },
      include: { product: true, level: true },
    });

    if (!bazaProLevel) {
      throw new BadRequestException('Profession level not found !');
    }

    return bazaProLevel;
  }

  async update(id: number, updateProductLevelDto: UpdateProductLevelDto) {
    const bazaProLevel = await this.findOne(id);
    if (bazaProLevel) {
      return {
        updateProductLeve: await this.prisma.productLevel.update({
          where: { id: Number(id) },
          data: updateProductLevelDto,
        }),
      };
    }
  }

  async remove(id: number) {
    const bazaProLevel = await this.findOne(id);
    if (bazaProLevel) {
      return {
        deleted: await this.prisma.productLevel.delete({
          where: { id: Number(id) },
        }),
      };
    }
  }
}
