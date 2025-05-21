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
import { ApiTags, ApiQuery, ApiOperation, ApiBody } from '@nestjs/swagger';
import { GeneralService } from './general.service';
import { CreateGeneralDto } from './dto/create-general.dto';
import { UpdateGeneralDto } from './dto/update-general.dto';
import { AuthGuard } from '../Guards/auth.guard';
import { Role } from '../user/enum/role.enum';
import { RolesGuard } from '../Guards/roles.guard';
import { RoleDec } from '../user/decorator/roles.decorator';
@ApiTags('General')
@Controller('general')
export class GeneralController {
  constructor(private readonly generalService: GeneralService) {}

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new general record' })
  @ApiBody({
    description: 'General object to create',
    schema: {
      example: {
        email: 'example@gmail.com',
        links: 'https://example.com',
        phone: '+998901234567',
        addminsTg: '@exampleAdmin',
      },
    },
  })
  create(@Body() createGeneralDto: CreateGeneralDto) {
    return this.generalService.create(createGeneralDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all general records with pagination and filter',
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
    name: 'email',
    required: false,
    description: 'Filter by email',
  })
  @ApiQuery({
    name: 'phone',
    required: false,
    description: 'Filter by phone',
  })
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('email') email?: string,
    @Query('phone') phone?: string,
  ) {
    const paginationOptions = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      email: email || undefined,
      phone: phone || undefined,
    };
    return this.generalService.findAll(paginationOptions);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a general record by ID' })
  findOne(@Param('id') id: string) {
    return this.generalService.findOne(+id);
  }

  @RoleDec(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a general record by ID' })
  @ApiBody({
    description: 'General object to update',
    schema: {
      example: {
        email: 'updated@gmail.com',
        links: 'https://updated-example.com',
        phone: '+998901234567',
        addminsTg: '@updatedAdmin',
      },
    },
  })
  update(@Param('id') id: string, @Body() updateGeneralDto: UpdateGeneralDto) {
    return this.generalService.update(+id, updateGeneralDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a general record by ID' })
  remove(@Param('id') id: string) {
    return this.generalService.remove(+id);
  }
}
