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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BrendService } from './brend.service';
import { CreateBrendDto } from './dto/create-brend.dto';
import { UpdateBrendDto } from './dto/update-brend.dto';
import { AuthGuard } from 'src/No_Connection_Tables/Guards/auth.guard';
import { RoleDec } from 'src/No_Connection_Tables/user/decorator/roles.decorator';
import { Role } from 'src/No_Connection_Tables/user/enum/role.enum';
import { RolesGuard } from 'src/No_Connection_Tables/Guards/roles.guard';

@ApiTags('brend')
@Controller('brend')
export class BrendController {
  constructor(private readonly brendService: BrendService) {}

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new brend' })
  @ApiResponse({
    status: 201,
    description: 'Brend created successfully.',
    type: CreateBrendDto,
    schema: {
      example: {
        id: 1,
        name: 'Samsung',
        createdAt: '2025-05-21T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createBrendDto: CreateBrendDto) {
    return this.brendService.create(createBrendDto);
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get list of brends with pagination and optional name filter',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number, default 1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page, default 10',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Filter by name substring',
  })
  @ApiResponse({
    status: 200,
    description: 'List of brends with pagination',
    schema: {
      example: {
        data: [
          { id: 1, name: 'Samsung', createdAt: '2025-05-21T12:00:00.000Z' },
          { id: 2, name: 'Apple', createdAt: '2025-05-20T11:00:00.000Z' },
        ],
        meta: {
          total: 2,
          page: 1,
          lastPage: 1,
        },
      },
    },
  })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('name') name?: string,
  ) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    return this.brendService.findAll({
      page: pageNumber > 0 ? pageNumber : 1,
      limit: limitNumber > 0 ? limitNumber : 10,
      name,
    });
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get brend by ID' })
  @ApiResponse({
    status: 200,
    description: 'Brend found',
    schema: {
      example: {
        id: 1,
        name: 'Samsung',
        createdAt: '2025-05-21T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Brend not found' })
  findOne(@Param('id') id: string) {
    return this.brendService.findOne(+id);
  }

  @RoleDec(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update brend by ID' })
  @ApiResponse({
    status: 200,
    description: 'Brend updated',
    schema: {
      example: {
        id: 1,
        name: 'Samsung Updated',
        updatedAt: '2025-05-22T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Brend not found' })
  update(@Param('id') id: string, @Body() updateBrendDto: UpdateBrendDto) {
    return this.brendService.update(+id, updateBrendDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete brend by ID' })
  @ApiResponse({
    status: 200,
    description: 'Brend deleted',
    schema: {
      example: { message: 'Brend with ID 1 has been deleted' },
    },
  })
  @ApiResponse({ status: 404, description: 'Brend not found' })
  remove(@Param('id') id: string) {
    return this.brendService.remove(+id);
  }
}
