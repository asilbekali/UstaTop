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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { RoleDec } from '../user/decorator/roles.decorator';
import { Role } from '../user/enum/role.enum';
import { RolesGuard } from '../Guards/roles.guard';
import { AuthGuard } from '../Guards/auth.guard';
@ApiTags('region')
@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new region' })
  @ApiBody({ type: CreateRegionDto })
  @ApiResponse({
    status: 201,
    description: 'The region has been successfully created.',
    type: CreateRegionDto,
  })
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get paginated list of regions, optionally filtered by name',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by region name',
    example: 'Toshkent',
  })
  @ApiResponse({
    status: 200,
    description: 'List of regions',
    type: [CreateRegionDto],
  })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('name') name?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.regionService.findAll({
      page: pageNumber,
      limit: limitNumber,
      name,
    });
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a region by id' })
  @ApiParam({ name: 'id', description: 'Region ID' })
  @ApiResponse({
    status: 200,
    description: 'The found region',
    type: CreateRegionDto,
  })
  @ApiResponse({ status: 404, description: 'Region not found' })
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(+id);
  }

  @RoleDec(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a region by id' })
  @ApiParam({ name: 'id', description: 'Region ID' })
  @ApiBody({ type: UpdateRegionDto })
  @ApiResponse({
    status: 200,
    description: 'The updated region',
    type: UpdateRegionDto,
  })
  @ApiResponse({ status: 404, description: 'Region not found' })
  update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(+id, updateRegionDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a region by id' })
  @ApiParam({ name: 'id', description: 'Region ID' })
  @ApiResponse({ status: 200, description: 'Region deleted' })
  @ApiResponse({ status: 404, description: 'Region not found' })
  remove(@Param('id') id: string) {
    return this.regionService.remove(+id);
  }
}
