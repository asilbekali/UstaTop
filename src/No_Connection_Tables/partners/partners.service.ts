import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Prisma } from '@prisma/client'; 
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePartnerDto) {
    try {
      return await this.prisma.partners.create({
        data: {
          name: dto.name,
          image: dto.image,
        },
      });
    } catch (error) {
      console.error('Error creating partner:', error);
      throw new InternalServerErrorException('Failed to create partner.');
    }
  }

  async findAll(filter: { page?: number; limit?: number; name?: string }) {
    try {
      const { page = 1, limit = 10, name } = filter;

      const where = name
        ? {
            name: {
              contains: name,
              mode: Prisma.QueryMode.insensitive, 
            },
          }
        : {};

      const partners = await this.prisma.partners.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await this.prisma.partners.count({ where });

      return {
        data: partners,
        total,
        page,
        limit,
      };
    } catch (error) {
      console.error('Error fetching partners:', error);
      throw new InternalServerErrorException('Failed to fetch partners.');
    }
  }

  async findOne(id: number) {
    try {
      const partner = await this.prisma.partners.findUnique({ where: { id } });

      if (!partner) {
        throw new NotFoundException(`Partner with ID ${id} not found.`);
      }

      return partner;
    } catch (error) {
      console.error(`Error fetching partner with ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch partner.');
    }
  }

  async update(id: number, updatePartnerDto: UpdatePartnerDto) {
    try {
      const partner = await this.prisma.partners.findUnique({ where: { id } });

      if (!partner) {
        throw new NotFoundException(`Partner with ID ${id} not found.`);
      }

      return await this.prisma.partners.update({
        where: { id },
        data: updatePartnerDto,
      });
    } catch (error) {
      console.error(`Error updating partner with ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update partner.');
    }
  }

  async remove(id: number) {
    try {
      const partner = await this.prisma.partners.findUnique({ where: { id } });

      if (!partner) {
        throw new NotFoundException(`Partner with ID ${id} not found.`);
      }

      return await this.prisma.partners.delete({ where: { id } });
    } catch (error) {
      console.error(`Error removing partner with ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to remove partner.');
    }
  }
}
