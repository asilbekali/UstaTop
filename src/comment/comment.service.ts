import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/No_Connection_Tables/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateCommentDto) {
    const bazaMaster = await this.prisma.master.findFirst({
      where: { id: dto.masterId },
    });

    if (!bazaMaster) {
      throw new BadRequestException('Master not found !');
    }

    const newComment = await this.prisma.comment.create({
      data: {
        message: dto.message,
        masterId: dto.masterId,
        stars: dto.stars,
      },
    });

    return newComment;
  }

  async findAll(query: {
    pageNumber: number;
    limitNumber: number;
    masterIdNumber?: number;
  }) {
    const { pageNumber, limitNumber, masterIdNumber } = query;
    const skip = (pageNumber - 1) * limitNumber;

    const where = masterIdNumber ? { masterId: masterIdNumber } : {};

    const total = await this.prisma.comment.count({ where });

    const comments = await this.prisma.comment.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: {
        id: 'desc',
      },
    });

    return {
      data: comments,
      total,
      page: pageNumber,
      lastPage: Math.ceil(total / limitNumber),
    };
  }

  async findOne(id: number) {
    const bazaComment = await this.prisma.comment.findFirst({
      where: { id: id },
    });

    if (!bazaComment) {
      throw new BadRequestException('Comment not found');
    }

    return bazaComment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const bazaMaster = await this.prisma.master.findFirst({
      where: { id: updateCommentDto.masterId },
    });
    if (!bazaMaster) {
      throw new BadRequestException('Master not found !');
    }
    const bazaComment = await this.findOne(id);
    if (bazaComment) {
      return await this.prisma.comment.update({
        where: { id: id },
        data: updateCommentDto,
      });
    }
  }

  async remove(id: number) {
    const bazaComment = await this.findOne(id);
    if (bazaComment) {
      const delCom = await this.prisma.comment.delete({ where: { id: id } });
      return { message: 'Comment deleted succesffully', deleted: delCom };
    }
  }
}
