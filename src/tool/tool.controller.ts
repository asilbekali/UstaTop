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
import { ToolService } from './tool.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { RoleDec } from 'src/No_Connection_Tables/user/decorator/roles.decorator';
import { Role } from 'src/No_Connection_Tables/user/enum/role.enum';
import { RolesGuard } from 'src/No_Connection_Tables/Guards/roles.guard';
import { AuthGuard } from 'src/No_Connection_Tables/Guards/auth.guard';

@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createToolDto: CreateToolDto) {
    return this.toolService.create(createToolDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get list of tools with pagination and filtering',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number, default is 1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page, default is 10',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Filter by name',
  })
  @ApiQuery({
    name: 'brendId',
    required: false,
    type: Number,
    description: 'Filter by brand ID',
  })
  @ApiQuery({
    name: 'sizeId',
    required: false,
    type: Number,
    description: 'Filter by size ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of tools with pagination and optional filters',
  })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('name') name?: string,
    @Query('brendId') brendId?: number,
    @Query('sizeId') sizeId?: number,
  ) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    return this.toolService.findAll({
      page: pageNumber > 0 ? pageNumber : 1,
      limit: limitNumber > 0 ? limitNumber : 10,
      filters: {
        name,
        brendId: brendId ? +brendId : undefined,
        sizeId: sizeId ? +sizeId : undefined,
      },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toolService.findOne(+id);
  }

  @RoleDec(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return this.toolService.update(+id, updateToolDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toolService.remove(+id);
  }
}
