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
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ShowCaseService } from './show-case.service';
import { CreateShowCaseDto } from './dto/create-show-case.dto';
import { UpdateShowCaseDto } from './dto/update-show-case.dto';
import { AuthGuard } from '../Guards/auth.guard';
import { RoleDec } from '../user/decorator/roles.decorator';
import { Role } from '../user/enum/role.enum';
import { RolesGuard } from '../Guards/roles.guard';

@ApiTags('ShowCase')
@Controller('show-case')
export class ShowCaseController {
  constructor(private readonly showCaseService: ShowCaseService) {}

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new showcase record' })
  @ApiBody({
    description: 'Showcase object to create',
    schema: {
      example: {
        name: 'Awesome Project',
        description: 'A detailed description of the project.',
        image: 'https://example.com/image.jpg',
        link: 'https://example.com',
      },
    },
  })
  create(@Body() createShowCaseDto: CreateShowCaseDto) {
    return this.showCaseService.create(createShowCaseDto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all showcase records with pagination and optional filter by name',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (default: 10)',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by name (partial match)',
  })
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('name') name?: string,
  ) {
    const paginationOptions = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      name: name || '',
    };
    return this.showCaseService.findAll(paginationOptions);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a showcase record by ID' })
  findOne(@Param('id') id: string) {
    return this.showCaseService.findOne(+id);
  }

  @RoleDec(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a showcase record by ID' })
  @ApiBody({
    description: 'Showcase object to update',
    schema: {
      example: {
        name: 'Updated Project Name',
        description: 'Updated description of the project.',
        image: 'https://example.com/new-image.jpg',
        link: 'https://updated-link.com',
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateShowCaseDto: UpdateShowCaseDto,
  ) {
    return this.showCaseService.update(+id, updateShowCaseDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a showcase record by ID' })
  remove(@Param('id') id: string) {
    return this.showCaseService.remove(+id);
  }
}
