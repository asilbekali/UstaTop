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
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { AuthGuard } from '../Guards/auth.guard';
import { RoleDec } from '../user/decorator/roles.decorator';
import { Role } from '../user/enum/role.enum';
import { RolesGuard } from '../Guards/roles.guard';

@ApiTags('partners')
@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new partner' })
  @ApiBody({
    description: 'Create partner payload',
    type: CreatePartnerDto,
    examples: {
      example1: {
        value: {
          name: 'Partner Name',
          image: 'pictuer.png',
        },
      },
    },
  })
  create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnersService.create(createPartnerDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all partners with pagination and optional name filter',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Filter by name (optional)',
  })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('name') name?: string,
  ) {
    const filter = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      ...(name ? { name: name.trim() } : {}),
    };
    return this.partnersService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single partner by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the partner',
    type: Number,
    example: 1,
  })
  findOne(@Param('id') id: string) {
    return this.partnersService.findOne(+id);
  }

  @RoleDec(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a partner by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the partner to update',
    type: Number,
    example: 1,
  })
  @ApiBody({
    description: 'Update partner payload',
    type: UpdatePartnerDto,
    examples: {
      example1: {
        value: {
          name: 'Updated Partner Name',
          image: 'updatePhoto.png',
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnersService.update(+id, updatePartnerDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a partner by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the partner to delete',
    type: Number,
    example: 1,
  })
  remove(@Param('id') id: string) {
    return this.partnersService.remove(+id);
  }
}
