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
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CapacityService } from './capacity.service';
import { CreateCapacityDto } from './dto/create-capacity.dto';
import { UpdateCapacityDto } from './dto/update-capacity.dto';
import { AuthGuard } from 'src/No_Connection_Tables/Guards/auth.guard';
import { RoleDec } from 'src/No_Connection_Tables/user/decorator/roles.decorator';
import { Role } from 'src/No_Connection_Tables/user/enum/role.enum';
import { RolesGuard } from 'src/No_Connection_Tables/Guards/roles.guard';


@ApiTags('Capacities')
@Controller('capacity')
export class CapacityController {
  constructor(private readonly capacityService: CapacityService) {}

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new capacity' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Small' },
      },
      required: ['name'],
      example: {
        name: 'Small',
      },
    },
  })
  create(@Body() createCapacityDto: CreateCapacityDto) {
    return this.capacityService.create(createCapacityDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all capacities with optional filters and pagination',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('name') name?: string,
  ) {
    return this.capacityService.findAll({ page, limit, name });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a capacity by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the capacity',
    example: 1,
    type: Number,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.capacityService.findOne(id);
  }

  @RoleDec(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a capacity by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the capacity',
    example: 1,
    type: Number,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Medium' },
      },
      required: ['name'],
      example: {
        name: 'Medium',
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCapacityDto: UpdateCapacityDto,
  ) {
    return this.capacityService.update(id, updateCapacityDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a capacity by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the capacity',
    example: 1,
    type: Number,
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.capacityService.remove(id);
  }
}
