import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRegionDto) {
    const data = await this.prisma.region.findFirst({
      where: { name: dto.name },
    });

    if (data) {
      throw new BadRequestException('This region already exists!');
    }
    return await this.prisma.region.create({ data: dto });
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
    const where = name
      ? { name: { contains: name, mode: Prisma.QueryMode.insensitive } }
      : {};
    return await this.prisma.region.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new BadRequestException('Id must be a positive number');
    }

    const region = await this.prisma.region.findUnique({
      where: { id },
    });
    if (!region) {
      throw new BadRequestException('Region not found');
    }
    return region;
  }

  async update(id: number, updateRegionDto: UpdateRegionDto) {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new BadRequestException('Id must be a positive number');
    }

    const region = await this.prisma.region.findUnique({ where: { id } });
    if (!region) {
      throw new BadRequestException('Region not found');
    }
    return await this.prisma.region.update({
      where: { id },
      data: updateRegionDto,
    });
  }

  async remove(id: number) {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new BadRequestException('Id must be a positive number');
    }

    const region = await this.prisma.region.findUnique({ where: { id } });
    if (!region) {
      throw new BadRequestException('Region not found');
    }
    return await this.prisma.region.delete({ where: { id } });
  }
}
