import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateShowCaseDto } from './dto/create-show-case.dto';
import { UpdateShowCaseDto } from './dto/update-show-case.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShowCaseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateShowCaseDto) {
    try {
      return await this.prisma.showCase.create({
        data: {
          name: dto.name,
          description: dto.description,
          image: dto.image,
          link: dto.link,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create showcase');
    }
  }

  async findAll(paginationOptions: {
    page?: number;
    limit?: number;
    name?: string;
  }) {
    try {
      const { page = 1, limit = 10, name } = paginationOptions;
      const take = limit;
      const skip = (page - 1) * take;

      const where =
        name && name.trim() !== ''
          ? {
              name: {
                contains: name,
                mode: 'insensitive' as const,
              },
            }
          : {};

      return await this.prisma.showCase.findMany({
        where,
        take,
        skip,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch showcase records',
      );
    }
  }

  async findOne(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('ID must be a valid number');
    }
    try {
      const showCase = await this.prisma.showCase.findUnique({
        where: { id },
      });

      if (!showCase) {
        throw new NotFoundException(`Showcase with ID ${id} not found`);
      }
      return showCase;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch showcase');
    }
  }

  async update(id: number, dto: UpdateShowCaseDto) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('ID must be a valid number');
    }
    try {
      const existing = await this.prisma.showCase.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Showcase with ID ${id} not found`);
      }
      return await this.prisma.showCase.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update showcase');
    }
  }

  async remove(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException('ID must be a valid number');
    }
    try {
      const existing = await this.prisma.showCase.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Showcase with ID ${id} not found`);
      }
      return await this.prisma.showCase.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete showcase');
    }
  }
}
