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
import { LevelService } from './level.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { AuthGuard } from 'src/No_Connection_Tables/Guards/auth.guard';
import { RoleDec } from 'src/No_Connection_Tables/user/decorator/roles.decorator';
import { Role } from 'src/No_Connection_Tables/user/enum/role.enum';
import { RolesGuard } from 'src/No_Connection_Tables/Guards/roles.guard';

@UseGuards(AuthGuard)
@ApiTags('Levels')
@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new level' })
  @ApiBody({
    description: 'Payload for creating a level',
    examples: {
      example1: {
        summary: 'Basic Level',
        value: {
          name: 'Beginner',
        },
      },
    },
  })
  create(@Body() createLevelDto: CreateLevelDto) {
    return this.levelService.create(createLevelDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all levels with optional filters and pagination',
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'name', required: false })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('name') name?: string,
  ) {
    return this.levelService.findAll({ page, limit, name });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a level by ID' })
  @ApiParam({ name: 'id', description: 'ID of the level', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.levelService.findOne(id);
  }

  @RoleDec(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a level by ID' })
  @ApiParam({ name: 'id', description: 'ID of the level', example: 1 })
  @ApiBody({
    description: 'Payload for updating a level',
    examples: {
      example1: {
        summary: 'Update to Advanced Level',
        value: {
          name: 'Advanced',
        },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLevelDto: UpdateLevelDto,
  ) {
    return this.levelService.update(id, updateLevelDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a level by ID' })
  @ApiParam({ name: 'id', description: 'ID of the level', example: 1 })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.levelService.remove(id);
  }
}
