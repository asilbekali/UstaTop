import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { BacketService } from './backet.service';
import { CreateBacketDto } from './dto/create-backet.dto';
import { UpdateBacketDto } from './dto/update-backet.dto';

@ApiTags('Backet')
@Controller('backet')
export class BacketController {
  constructor(private readonly backetService: BacketService) {}

  @Post()
  create(@Body() createBacketDto: CreateBacketDto) {
    return this.backetService.create(createBacketDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number, default 1' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page, default 10' })
  @ApiQuery({ name: 'orderIteamId', required: false, type: Number, description: 'Filter by order item ID' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('orderIteamId') orderIteamId?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    const orderIteamIdNumber = orderIteamId ? parseInt(orderIteamId, 10) : undefined;

    return this.backetService.findAll({
      page: pageNumber,
      limit: limitNumber,
      orderIteamId: orderIteamIdNumber,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.backetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBacketDto: UpdateBacketDto) {
    return this.backetService.update(+id, updateBacketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.backetService.remove(+id);
  }
}
