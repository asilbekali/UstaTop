import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/No_Connection_Tables/prisma/prisma.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { Prisma } from '@prisma/client'; // <-- Prisma enum import qilindi

interface PaginationParams {
  page: number;
  limit: number;
  name?: string;
}

@Injectable()
export class SizeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSizeDto: CreateSizeDto) {
    try {
      return await this.prisma.size.create({
        data: {
          name: createSizeDto.name,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create size');
    }
  }

  async findAll(params: PaginationParams) {
    const { page, limit, name } = params;

    try {
      const where = name
        ? {
            name: {
              contains: name,
              mode: Prisma.QueryMode.insensitive, // enum yordamida
            },
          }
        : {};

      const sizes = await this.prisma.size.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
      });

      const totalCount = await this.prisma.size.count({ where });

      return {
        data: sizes,
        total: totalCount,
        page,
        lastPage: Math.ceil(totalCount / limit),
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch sizes');
    }
  }

  async findOne(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('ID must be a number');
    }

    try {
      const size = await this.prisma.size.findUnique({ where: { id } });
      if (!size) {
        throw new NotFoundException(`Size with ID ${id} not found`);
      }
      return size;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to fetch size');
    }
  }

  async update(id: number, updateSizeDto: UpdateSizeDto) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('ID must be a number');
    }

    try {
      const existingSize = await this.prisma.size.findUnique({ where: { id } });
      if (!existingSize) {
        throw new NotFoundException(`Size with ID ${id} not found`);
      }

      return await this.prisma.size.update({
        where: { id },
        data: updateSizeDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to update size');
    }
  }

  async remove(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('ID must be a number');
    }

    try {
      const existingSize = await this.prisma.size.findUnique({ where: { id } });
      if (!existingSize) {
        throw new NotFoundException(`Size with ID ${id} not found`);
      }

      await this.prisma.size.delete({ where: { id } });

      return { message: `Size with ID ${id} has been deleted` };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to delete size');
    }
  }
}
