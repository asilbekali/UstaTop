import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { PrismaService } from 'src/No_Connection_Tables/prisma/prisma.service';
import { masterProduct, Prisma } from '@prisma/client';

@Injectable()
export class MasterService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMasterDto) {
    const bazaMaster = await this.prisma.master.findFirst({
      where: { email: dto.email },
    });

    if (bazaMaster) {
      throw new ConflictException('Master already exists!');
    }

    for (const obj of dto.jobs) {
      const bazaPro = await this.prisma.product.findFirst({
        where: { id: obj.prof_id },
      });

      const bazaLevel = await this.prisma.level.findFirst({
        where: { id: obj.level_id },
      });

      if (!bazaPro) {
        throw new BadRequestException('Profession not found!');
      }

      if (!bazaLevel) {
        throw new BadRequestException('Level not found!');
      }
    }
    const newMaster = await this.prisma.master.create({
      data: {
        full_name: dto.full_name,
        email: dto.email,
        year: dto.year,
        image: dto.image,
        passpoerImage: dto.passpoerImage,
        about: dto.about,
        star: 0,
        isWork: false,
      },
    });

    const masterPro: masterProduct[] = [];

    for (const obj2 of dto.jobs) {
      const createdMasterPro = await this.prisma.masterProduct.create({
        data: {
          productId: obj2.prof_id,
          levelId: obj2.level_id,
          minWorkHour: obj2.minworkhour,
          priceDay: obj2.price_day,
          priceHour: obj2.price_hour,
          exprience: obj2.experince,
          masterId: newMaster.id,
        },
      });
      masterPro.push(createdMasterPro);
    }

    return {
      newMaster,
      masterProfession: masterPro,
    };
  }
  async findAll(page: number = 1, limit: number = 10, full_name?: string) {
    const skip = (page - 1) * limit;

    const where = full_name
      ? {
          full_name: {
            contains: full_name,
            mode: 'insensitive' as Prisma.QueryMode,
          },
        }
      : {};

    const total = await this.prisma.master.count({ where });

    const masters = await this.prisma.master.findMany({
      where,
      skip,
      take: limit,
      include: {
        masterProduct: true,
      },
    });

    return {
      data: masters,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const master = await this.prisma.master.findUnique({
      where: { id },
      include: {
        masterProduct: true,
      },
    });

    if (!master) {
      throw new NotFoundException(`Master with id ${id} not found`);
    }

    return master;
  }

  async update(id: number, updateMasterDto: UpdateMasterDto) {
    const master = await this.prisma.master.findUnique({
      where: { id },
    });

    if (!master) {
      throw new NotFoundException(`Master with id ${id} not found`);
    }

    if (updateMasterDto.jobs && updateMasterDto.jobs.length > 0) {
      for (const obj of updateMasterDto.jobs) {
        const bazaPro = await this.prisma.product.findUnique({
          where: { id: obj.prof_id },
        });
        if (!bazaPro) {
          throw new BadRequestException(
            `Profession with id ${obj.prof_id} not found!`,
          );
        }

        const bazaLevel = await this.prisma.level.findUnique({
          where: { id: obj.level_id },
        });
        if (!bazaLevel) {
          throw new BadRequestException(
            `Level with id ${obj.level_id} not found!`,
          );
        }
      }

      await this.prisma.masterProduct.deleteMany({
        where: { masterId: id },
      });

      for (const obj of updateMasterDto.jobs) {
        await this.prisma.masterProduct.create({
          data: {
            productId: obj.prof_id,
            levelId: obj.level_id,
            minWorkHour: obj.minworkhour,
            priceDay: obj.price_day,
            priceHour: obj.price_hour,
            exprience: obj.experince,
            masterId: id,
          },
        });
      }
    }
    const updatedMaster = await this.prisma.master.update({
      where: { id },
      data: {
        full_name: updateMasterDto.full_name,
        email: updateMasterDto.email,
        year: updateMasterDto.year,
        image: updateMasterDto.image,
        passpoerImage: updateMasterDto.passpoerImage,
        about: updateMasterDto.about,
      },
    });

    return updatedMaster;
  }

  async remove(id: number) {
    const master = await this.prisma.master.findUnique({
      where: { id },
    });

    if (!master) {
      throw new NotFoundException(`Master with id ${id} not found`);
    }

    await this.prisma.masterProduct.deleteMany({
      where: { masterId: id },
    });

    await this.prisma.master.delete({
      where: { id },
    });

    return { message: `Master with id ${id} has been deleted` };
  }
}
