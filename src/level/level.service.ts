import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { PrismaService } from 'src/No_Connection_Tables/prisma/prisma.service';

@Injectable()
export class LevelService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLevelDto: CreateLevelDto) {
    const bazaLevel = await this.prisma.level.findFirst({
      where: { name: createLevelDto.name },
    });

    console.log(bazaLevel);
    

    if(bazaLevel){
      console.log(bazaLevel);
      
      throw new BadRequestException("Level name must be uniqe !")
    }

    try {
      return await this.prisma.level.create({
        data: {
          name: createLevelDto.name,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create level: ${error.message}`);
    }
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
    try {
      const skip = (Number(page) - 1) * Number(limit);
      const filters: any = {};
      if (name) {
        filters.name = { contains: name };
      }

      const levels = await this.prisma.level.findMany({
        where: filters,
        skip,
        take: Number(limit),
      });

      const total = await this.prisma.level.count({ where: filters });

      return {
        data: levels,
        total,
        page: Number(page),
        limit: Number(limit),
      };
    } catch (error) {
      throw new Error(`Failed to fetch levels: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const level = await this.prisma.level.findUnique({
        where: { id },
      });

      if (!level) {
        throw new NotFoundException(`Level with ID ${id} not found`);
      }

      return level;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to fetch level with ID ${id}: ${error.message}`);
    }
  }

  async update(id: number, updateLevelDto: UpdateLevelDto) {
    try {
      const existingLevel = await this.prisma.level.findUnique({
        where: { id },
      });

      if (!existingLevel) {
        throw new NotFoundException(`Level with ID ${id} not found`);
      }

      return await this.prisma.level.update({
        where: { id },
        data: {
          name: updateLevelDto.name,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update level with ID ${id}: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const existingLevel = await this.prisma.level.findUnique({
        where: { id },
      });

      if (!existingLevel) {
        throw new NotFoundException(`Level with ID ${id} not found`);
      }

      return await this.prisma.level.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to delete level with ID ${id}: ${error.message}`);
    }
  }
}
