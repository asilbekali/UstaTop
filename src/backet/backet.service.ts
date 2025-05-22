import { Injectable } from '@nestjs/common';
import { CreateBacketDto } from './dto/create-backet.dto';
import { UpdateBacketDto } from './dto/update-backet.dto';

@Injectable()
export class BacketService {
  create(createBacketDto: CreateBacketDto) {
    return 'This action adds a new backet';
  }

  findAll({page, limit, orderIteamId}) {
    return `This action returns all backet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} backet`;
  }

  update(id: number, updateBacketDto: UpdateBacketDto) {
    return `This action updates a #${id} backet`;
  }

  remove(id: number) {
    return `This action removes a #${id} backet`;
  }
}
