import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/No_Connection_Tables/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { name } from 'ejs';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateProductDto) {
    const bazaPro = await this.prisma.product.findFirst({
      where: { name: dto.name },
    });

    if (bazaPro) {
      throw new BadRequestException('Proffesion must be uniqe !');
    }

    const newPro = await this.prisma.product.create({
      data: {
        name: dto.name,
        isActive: true,
        image: dto.image,
      },
    });

    return newPro;
  }

  async findAll(query: { page?: number; limit?: number; name?: string }) {
    const { page = 1, limit = 10, name } = query;

    const where: Prisma.productWhereInput = name
      ? {
          name: {
            contains: name,
            mode: Prisma.QueryMode.insensitive,
          },
        }
      : {};

    const skip = (page - 1) * limit;
    const take = Number(limit);

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        include: { productLevel: true, productTools: true},
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id }, include: {productTools: true}
    });

    if (!product) {
      throw new BadRequestException(`Profession with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const bazaPro = await this.findOne(id);
    if (bazaPro) {
      return {
        updated_Profession: await this.prisma.product.update({
          where: { id: id },
          data: { name: updateProductDto.name, image: updateProductDto.image },
        }),
      };
    }
  }

  async remove(id: number) {
    const bazaPro = await this.findOne(id);
    if (bazaPro) {
      return {
        deleted_Profession: await this.prisma.product.delete({
          where: { id: id },
        }),
      };
    }
  }
}
