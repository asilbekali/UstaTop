import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { UpdateSuggestionDto } from './dto/update-suggestion.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuggestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSuggestionDto) {
    try {
      return await this.prisma.sugesstion.create({
        data: {
          name: dto.name,
          suerName: dto.surName,
          message: dto.message,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create suggestion');
    }
  }

  async findAll(filter: { page?: number; limit?: number; name?: string }) {
    try {
      const { page = 1, limit = 10, name } = filter;
      const take = limit;
      const skip = (page - 1) * take;

      const where: Prisma.sugesstionWhereInput = name
        ? {
            name: {
              contains: name,
              mode: Prisma.QueryMode.insensitive,
            },
          }
        : {};

      const [data, total] = await Promise.all([
        this.prisma.sugesstion.findMany({
          where,
          skip,
          take,
        }),
        this.prisma.sugesstion.count({ where }),
      ]);

      return {
        data,
        total,
        page,
        pageCount: Math.ceil(total / take),
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch suggestions');
    }
  }

  async findOne(id: number) {
    try {
      if (isNaN(id)) {
        throw new BadRequestException('ID must be a valid number');
      }

      const suggestion = await this.prisma.sugesstion.findUnique({
        where: { id },
      });

      if (!suggestion) {
        throw new NotFoundException(`Suggestion with ID ${id} not found`);
      }

      return suggestion;
    } catch (error) {
      throw error instanceof NotFoundException ||
        error instanceof BadRequestException
        ? error
        : new InternalServerErrorException('Failed to fetch suggestion');
    }
  }

  async update(id: number, updateSuggestionDto: UpdateSuggestionDto) {
    try {
      if (isNaN(id)) {
        throw new BadRequestException('ID must be a valid number');
      }

      const existingSuggestion = await this.prisma.sugesstion.findUnique({
        where: { id },
      });

      if (!existingSuggestion) {
        throw new NotFoundException(`Suggestion with ID ${id} not found`);
      }

      return await this.prisma.sugesstion.update({
        where: { id },
        data: {
          name: updateSuggestionDto.name,
          suerName: updateSuggestionDto.surName,
          message: updateSuggestionDto.message,
        },
      });
    } catch (error) {
      throw error instanceof NotFoundException ||
        error instanceof BadRequestException
        ? error
        : new InternalServerErrorException('Failed to update suggestion');
    }
  }

  async remove(id: number) {
    try {
      if (isNaN(id)) {
        throw new BadRequestException('ID must be a valid number');
      }

      const existingSuggestion = await this.prisma.sugesstion.findUnique({
        where: { id },
      });

      if (!existingSuggestion) {
        throw new NotFoundException(`Suggestion with ID ${id} not found`);
      }

      await this.prisma.sugesstion.delete({
        where: { id },
      });

      return { message: `Suggestion with ID ${id} successfully deleted` };
    } catch (error) {
      throw error instanceof NotFoundException ||
        error instanceof BadRequestException
        ? error
        : new InternalServerErrorException('Failed to delete suggestion');
    }
  }
}
