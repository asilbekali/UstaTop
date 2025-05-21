import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GeneralService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGeneralDto: any) {
    try {
      return await this.prisma.general.create({ data: createGeneralDto });
    } catch (error) {
      throw new BadRequestException('Failed to create the general record.');
    }
  }

  async findAll(pagination: {
    page: number;
    limit: number;
    email?: string;
    phone?: string;
  }) {
    try {
      const { limit, page, email, phone } = pagination;

      const take = limit || 10;
      const skip = ((page || 1) - 1) * take;

      // Filterni yaratamiz
      const where: Prisma.generalWhereInput = {};
      if (email) {
        where.email = { contains: email, mode: 'insensitive' };
      }
      if (phone) {
        where.phone = { contains: phone, mode: 'insensitive' };
      }

      return await this.prisma.general.findMany({
        where,
        take,
        skip,
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch records.');
    }
  }

  async findOne(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('ID must be a valid number.');
    }

    try {
      const record = await this.prisma.general.findUnique({
        where: { id },
      });

      if (!record) {
        throw new NotFoundException(`General record with ID ${id} not found.`);
      }

      return record;
    } catch (error) {
      throw new BadRequestException('Failed to fetch the record.');
    }
  }

  async update(id: number, updateGeneralDto: any) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('ID must be a valid number.');
    }

    try {
      const existingRecord = await this.prisma.general.findUnique({
        where: { id },
      });

      if (!existingRecord) {
        throw new NotFoundException(`General record with ID ${id} not found.`);
      }

      return await this.prisma.general.update({
        where: { id },
        data: updateGeneralDto,
      });
    } catch (error) {
      throw new BadRequestException('Failed to update the record.');
    }
  }

  async remove(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('ID must be a valid number.');
    }

    try {
      const existingRecord = await this.prisma.general.findUnique({
        where: { id },
      });

      if (!existingRecord) {
        throw new NotFoundException(`General record with ID ${id} not found.`);
      }

      return await this.prisma.general.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException('Failed to delete the record.');
    }
  }
}
