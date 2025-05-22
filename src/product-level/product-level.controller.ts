import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductLevelService } from './product-level.service';
import { CreateProductLevelDto } from './dto/create-product-level.dto';
import { UpdateProductLevelDto } from './dto/update-product-level.dto';
import { ApiQuery, ApiParam } from '@nestjs/swagger';
import { RoleDec } from 'src/No_Connection_Tables/user/decorator/roles.decorator';
import { Role } from 'src/No_Connection_Tables/user/enum/role.enum';
import { RolesGuard } from 'src/No_Connection_Tables/Guards/roles.guard';
import { AuthGuard } from 'src/No_Connection_Tables/Guards/auth.guard';

@Controller('product-level')
export class ProductLevelController {
  constructor(private readonly productLevelService: ProductLevelService) {}

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createProductLevelDto: CreateProductLevelDto) {
    return this.productLevelService.create(createProductLevelDto);
  }

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
  })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.productLevelService.findAll({ page, limit });
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the product level to retrieve',
    type: Number,
  })
  findOne(@Param('id') id: number) {
    return this.productLevelService.findOne(id);
  }

  @RoleDec(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the product level to update',
    type: Number,
  })
  update(
    @Param('id') id: number,
    @Body() updateProductLevelDto: UpdateProductLevelDto,
  ) {
    return this.productLevelService.update(id, updateProductLevelDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the product level to delete',
    type: Number,
  })
  remove(@Param('id') id: number) {
    return this.productLevelService.remove(id);
  }
}
