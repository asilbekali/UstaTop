import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { AuthGuard } from 'src/No_Connection_Tables/Guards/auth.guard';
import { RoleDec } from 'src/No_Connection_Tables/user/decorator/roles.decorator';
import { Role } from 'src/No_Connection_Tables/user/enum/role.enum';
import { RolesGuard } from 'src/No_Connection_Tables/Guards/roles.guard';

@ApiTags('size')
@Controller('size')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new size' })
  @ApiBody({ type: CreateSizeDto, description: 'Size data with name field' })
  @ApiResponse({ status: 201, description: 'Size successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  create(@Body() createSizeDto: CreateSizeDto) {
    return this.sizeService.create(createSizeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sizes with pagination and name filter' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination (default is 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (default is 10)',
    type: Number,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter sizes by name (partial match, case insensitive)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'List of sizes with pagination and optional name filter',
    schema: {
      example: {
        data: [
          { id: 1, name: 'Small' },
          { id: 2, name: 'Medium' },
        ],
        total: 20,
        page: 1,
        lastPage: 2,
      },
    },
  })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('name') name?: string,
  ) {
    return this.sizeService.findAll({
      page: Number(page),
      limit: Number(limit),
      name,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get size by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Size ID' })
  @ApiResponse({ status: 200, description: 'Size found' })
  @ApiResponse({ status: 404, description: 'Size not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sizeService.findOne(id);
  }
  @RoleDec(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update size by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Size ID' })
  @ApiBody({
    type: UpdateSizeDto,
    description: 'Updated size data with name field',
  })
  @ApiResponse({ status: 200, description: 'Size updated successfully' })
  @ApiResponse({ status: 404, description: 'Size not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSizeDto: UpdateSizeDto,
  ) {
    return this.sizeService.update(id, updateSizeDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete size by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Size ID' })
  @ApiResponse({ status: 200, description: 'Size deleted successfully' })
  @ApiResponse({ status: 404, description: 'Size not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sizeService.remove(id);
  }
}
