import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFaqDto) {
    try {
      return await this.prisma.faq.create({
        data: {
          answer: dto.answer,
          question: dto.question,
        },
      });
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw new InternalServerErrorException('Failed to create FAQ.');
    }
  }

  async findAll(filter: {
    page?: number | string;
    limit?: number | string;
    question?: string;
    answer?: string;
  }) {
    try {
      const page = filter.page ? Number(filter.page) : 1;
      const limit = filter.limit ? Number(filter.limit) : 10;

      const where: any = {};
      if (filter.question) {
        Object.assign(where, {
          question: {
            contains: filter.question,
            mode: 'insensitive',
          },
        });
      }
      if (filter.answer) {
        Object.assign(where, {
          answer: {
            contains: filter.answer,
            mode: 'insensitive',
          },
        });
      }

      const data = await this.prisma.faq.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await this.prisma.faq.count({ where });

      return {
        data,
        total,
        page,
        limit,
      };
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw new InternalServerErrorException('Failed to fetch FAQs.');
    }
  }

  async findOne(id: number) {
    try {
      const faq = await this.prisma.faq.findUnique({ where: { id } });

      if (!faq) {
        throw new NotFoundException(`FAQ with ID ${id} not found.`);
      }

      return faq;
    } catch (error) {
      console.error(`Error fetching FAQ with ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch FAQ.');
    }
  }

  async update(id: number, updateFaqDto: UpdateFaqDto) {
    try {
      const faq = await this.prisma.faq.findUnique({ where: { id } });

      if (!faq) {
        throw new NotFoundException(`FAQ with ID ${id} not found.`);
      }

      return await this.prisma.faq.update({
        where: { id },
        data: updateFaqDto,
      });
    } catch (error) {
      console.error(`Error updating FAQ with ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update FAQ.');
    }
  }

  async remove(id: number) {
    try {
      const faq = await this.prisma.faq.findUnique({ where: { id } });

      if (!faq) {
        throw new NotFoundException(`FAQ with ID ${id} not found.`);
      }

      return await this.prisma.faq.delete({ where: { id } });
    } catch (error) {
      console.error(`Error removing FAQ with ID ${id}:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to remove FAQ.');
    }
  }
}
