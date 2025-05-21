import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { PrismaService } from 'src/No_Connection_Tables/prisma/prisma.service';

@Injectable()
export class ToolService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateToolDto) {
    const bazaSize = await this.prisma.size.findFirst({
      where: { id: dto.sizeId },
    });
    if (!bazaSize) {
      throw new BadRequestException({ message: 'Size not found!' });
    }

    const bazaCapacity = await this.prisma.capasity.findFirst({
      where: { id: dto.capasityId },
    });
    if (!bazaCapacity) {
      throw new BadRequestException({ message: 'Capacity not found!' });
    }

    const bazaBrend = await this.prisma.brend.findFirst({
      where: { id: dto.brendId },
    });
    if (!bazaBrend) {
      throw new BadRequestException({ message: 'Brand not found!' });
    }

    const newTool = await this.prisma.tools.create({
      data: {
        name: dto.name,
        price: dto.price,
        count: dto.count,
        capasityId: dto.capasityId,
        sizeId: dto.sizeId,
        brendId: dto.brendId,
        image: dto.image || 'default-image-url.jpg',
        isActive: true,
      },
    });

    return {
      success: true,
      data: newTool,
    };
  }

  async findAll({
    page = 1,
    limit = 10,
    filters = {},
  }: {
    page?: number;
    limit?: number;
    filters?: any;
  }) {
    const skip = (page - 1) * limit;

    const whereClause = {
      ...filters,
    };

    const tools = await this.prisma.tools.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        size: true,
        capasity: true,
        brend: true,
      },
    });

    const totalRecords = await this.prisma.tools.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalRecords / limit);

    return {
      success: true,
      data: tools,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        pageSize: limit,
      },
    };
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException({ message: 'ID must be a valid number' });
    }

    const tool = await this.prisma.tools.findUnique({
      where: { id },
      include: {
        size: true,
        capasity: true,
        brend: true,
      },
    });

    if (!tool) {
      throw new NotFoundException({ message: 'Tool not found!' });
    }

    return {
      success: true,
      data: tool,
    };
  }

  async update(id: number, updateToolDto: UpdateToolDto) {
    if (isNaN(id)) {
      throw new BadRequestException({ message: 'ID must be a valid number' });
    }

    const toolExists = await this.prisma.tools.findUnique({
      where: { id },
    });
    if (!toolExists) {
      throw new NotFoundException({ message: 'Tool not found!' });
    }

    if (updateToolDto.sizeId) {
      const sizeExists = await this.prisma.size.findFirst({
        where: { id: updateToolDto.sizeId },
      });
      if (!sizeExists) {
        throw new BadRequestException({ message: 'Size not found!' });
      }
    }

    if (updateToolDto.capasityId) {
      const capacityExists = await this.prisma.capasity.findFirst({
        where: { id: updateToolDto.capasityId },
      });
      if (!capacityExists) {
        throw new BadRequestException({ message: 'Capacity not found!' });
      }
    }

    if (updateToolDto.brendId) {
      const brandExists = await this.prisma.brend.findFirst({
        where: { id: updateToolDto.brendId },
      });
      if (!brandExists) {
        throw new BadRequestException({ message: 'Brand not found!' });
      }
    }

    const updatedTool = await this.prisma.tools.update({
      where: { id },
      data: updateToolDto,
    });

    return {
      success: true,
      data: updatedTool,
    };
  }

  async remove(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException({ message: 'ID must be a valid number' });
    }

    const toolExists = await this.prisma.tools.findUnique({
      where: { id },
    });

    if (!toolExists) {
      throw new NotFoundException({ message: 'Tool not found!' });
    }

    const deletedTool = await this.prisma.tools.delete({
      where: { id },
    });

    return {
      success: true,
      data: deletedTool,
    };
  }
}
