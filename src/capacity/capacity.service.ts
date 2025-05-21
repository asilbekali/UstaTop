import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCapacityDto } from './dto/create-capacity.dto';
import { UpdateCapacityDto } from './dto/update-capacity.dto';
import { PrismaService } from 'src/No_Connection_Tables/prisma/prisma.service';

@Injectable()
export class CapacityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCapacityDto: CreateCapacityDto) {
    try {
      return await this.prisma.capasity.create({
        data: {
          name: createCapacityDto.name,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create capacity');
    }
  }
  async findAll({
    page = 1,
    limit = 10,
    name,
  }: {
    page?: number | string; // string ham kelishi mumkin deb yozsak
    limit?: number | string;
    name?: string;
  }) {
    try {
      const pageNum = Number(page);
      const limitNum = Number(limit);

      if (isNaN(pageNum) || pageNum < 1)
        throw new BadRequestException('Invalid page number');
      if (isNaN(limitNum) || limitNum < 1)
        throw new BadRequestException('Invalid limit number');

      const skip = (pageNum - 1) * limitNum;

      const where = name
        ? { name: { contains: name, mode: 'insensitive' as any } }
        : {};

      const [data, total] = await Promise.all([
        this.prisma.capasity.findMany({
          where,
          skip,
          take: limitNum, // bu yerda endi raqam bo‘ladi
        }),
        this.prisma.capasity.count({ where }),
      ]);

      return {
        data,
        total,
        page: pageNum,
        limit: limitNum,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to fetch capacities');
    }
  }

  async findOne(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('ID must be a number');
    }

    try {
      const capacity = await this.prisma.capasity.findUnique({
        where: { id },
      });

      if (!capacity) {
        throw new NotFoundException(`Capacity with ID ${id} not found`);
      }

      return capacity;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to get capacity');
    }
  }

  async update(id: number, updateCapacityDto: UpdateCapacityDto) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('ID must be a number');
    }

    try {
      const existingCapacity = await this.prisma.capasity.findUnique({
        where: { id },
      });

      if (!existingCapacity) {
        throw new NotFoundException(`Capacity with ID ${id} not found`);
      }

      return await this.prisma.capasity.update({
        where: { id },
        data: updateCapacityDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to update capacity');
    }
  }

  async remove(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('ID must be a number');
    }

    try {
      const existingCapacity = await this.prisma.capasity.findUnique({
        where: { id },
      });

      if (!existingCapacity) {
        throw new NotFoundException(`Capacity with ID ${id} not found`);
      }

      await this.prisma.capasity.delete({
        where: { id },
      });

      return { message: `Capacity with ID ${id} has been deleted` };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to delete capacity');
    }
  }
}
