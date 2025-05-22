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
import { ProductToolsService } from './product-tools.service';
import { CreateProductToolDto } from './dto/create-product-tool.dto';
import { UpdateProductToolDto } from './dto/update-product-tool.dto';
import { ApiQuery } from '@nestjs/swagger';
import { RoleDec } from 'src/No_Connection_Tables/user/decorator/roles.decorator';
import { Role } from 'src/No_Connection_Tables/user/enum/role.enum';
import { RolesGuard } from 'src/No_Connection_Tables/Guards/roles.guard';
import { AuthGuard } from 'src/No_Connection_Tables/Guards/auth.guard';

@Controller('product-tools')
export class ProductToolsController {
  constructor(private readonly productToolsService: ProductToolsService) {}

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createProductToolDto: CreateProductToolDto) {
    return this.productToolsService.create(createProductToolDto);
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
  @ApiQuery({
    name: 'productId',
    required: false,
    description: 'Filter by Product ID',
  })
  @ApiQuery({
    name: 'toolsId',
    required: false,
    description: 'Filter by Tools ID',
  })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('productId') productId?: number,
    @Query('toolsId') toolsId?: number,
  ) {
    return this.productToolsService.findAll({
      page,
      limit,
      productId,
      toolsId,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productToolsService.findOne(+id);
  }

  @RoleDec(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateProductToolDto: UpdateProductToolDto,
  ) {
    return this.productToolsService.update(+id, updateProductToolDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productToolsService.remove(+id);
  }
}
