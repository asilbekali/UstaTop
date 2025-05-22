import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateProductToolDto } from './dto/create-product-tool.dto';
import { UpdateProductToolDto } from './dto/update-product-tool.dto';
import { PrismaService } from 'src/No_Connection_Tables/prisma/prisma.service';

@Injectable()
export class ProductToolsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductToolDto: CreateProductToolDto) {
    const { productId, toolsId } = createProductToolDto;

    const productExists = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!productExists) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const toolExists = await this.prisma.tools.findUnique({
      where: { id: toolsId },
    });
    if (!toolExists) {
      throw new NotFoundException(`Tool with ID ${toolsId} not found`);
    }

    return this.prisma.productTools.create({
      data: createProductToolDto,
    });
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    productId?: number;
    toolsId?: number;
  }) {
    const { page = 1, limit = 10, productId, toolsId } = query;

    const where: any = {};
    if (productId) where.productId = Number(productId);
    if (toolsId) where.toolsId = Number(toolsId);

    const skip = (page - 1) * limit;
    const take = Number(limit);

    const [data, total] = await Promise.all([
      this.prisma.productTools.findMany({
        where,
        skip,
        take,
      }),
      this.prisma.productTools.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const productTool = await this.prisma.productTools.findUnique({
      where: { id },
    });
    if (!productTool) {
      throw new NotFoundException(`ProductTool with ID ${id} not found`);
    }
    return productTool;
  }

  async update(id: number, updateProductToolDto: UpdateProductToolDto) {
    const { productId, toolsId } = updateProductToolDto;

    // Tekshirish: `productTools` yozuvi mavjudligini tasdiqlash
    const productToolExists = await this.prisma.productTools.findUnique({
      where: { id },
    });
    if (!productToolExists) {
      throw new NotFoundException(`ProductTool with ID ${id} not found`);
    }

    // Tekshirish: `productId` mavjudligi
    if (productId) {
      const productExists = await this.prisma.product.findUnique({
        where: { id: productId },
      });
      if (!productExists) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }
    }

    if (toolsId) {
      const toolExists = await this.prisma.tools.findUnique({
        where: { id: toolsId },
      });
      if (!toolExists) {
        throw new NotFoundException(`Tool with ID ${toolsId} not found`);
      }
    }

    return this.prisma.productTools.update({
      where: { id },
      data: updateProductToolDto,
    });
  }

  async remove(id: number) {
    const productToolExists = await this.prisma.productTools.findUnique({
      where: { id },
    });
    if (!productToolExists) {
      throw new NotFoundException(`ProductTool with ID ${id} not found`);
    }

    return this.prisma.productTools.delete({
      where: { id },
    });
  }
}
