import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrendDto } from './dto/create-brend.dto';
import { UpdateBrendDto } from './dto/update-brend.dto';
import { PrismaService } from 'src/No_Connection_Tables/prisma/prisma.service';

interface FindAllParams {
  page?: number;
  limit?: number;
  name?: string;
}

@Injectable()
export class BrendService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBrendDto: CreateBrendDto) {
    try {
      return await this.prisma.brend.create({
        data: { name: createBrendDto.name },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create brend');
    }
  }

  async findAll(params: FindAllParams = {}) {
    const { page = 1, limit = 10, name } = params;

    const skip = (page - 1) * limit;

    // Bu yerda 'mode' ga string emas, 'any' deb tip qo'yiladi
    const where = name
      ? {
          name: {
            contains: name,
            mode: 'insensitive' as any,
          },
        }
      : {};

    try {
      const [items, total] = await Promise.all([
        this.prisma.brend.findMany({
          where,
          skip,
          take: limit,
        }),
        this.prisma.brend.count({ where }),
      ]);

      return {
        data: items,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch brends');
    }
  }

  async findOne(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('ID must be a valid number');
    }

    try {
      const brend = await this.prisma.brend.findUnique({ where: { id } });
      if (!brend) {
        throw new NotFoundException(`Brend with ID ${id} not found`);
      }
      return brend;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to fetch brend');
    }
  }

  async update(id: number, updateBrendDto: UpdateBrendDto) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('ID must be a valid number');
    }

    try {
      const existingBrend = await this.prisma.brend.findUnique({
        where: { id },
      });
      if (!existingBrend) {
        throw new NotFoundException(`Brend with ID ${id} not found`);
      }

      return await this.prisma.brend.update({
        where: { id },
        data: updateBrendDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to update brend');
    }
  }

  async remove(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('ID must be a valid number');
    }

    try {
      const existingBrend = await this.prisma.brend.findUnique({
        where: { id },
      });
      if (!existingBrend) {
        throw new NotFoundException(`Brend with ID ${id} not found`);
      }

      await this.prisma.brend.delete({ where: { id } });

      return { message: `Brend with ID ${id} has been deleted` };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to delete brend');
    }
  }
}
