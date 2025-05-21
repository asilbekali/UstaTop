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
import { SuggestionsService } from './suggestions.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { UpdateSuggestionDto } from './dto/update-suggestion.dto';
import { AuthGuard } from '../Guards/auth.guard';
import { RoleDec } from '../user/decorator/roles.decorator';
import { Role } from '../user/enum/role.enum';
import { RolesGuard } from '../Guards/roles.guard';

@UseGuards(AuthGuard)
@ApiTags('suggestions')
@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new suggestion' })
  @ApiBody({
    description: 'Create suggestion payload',
    type: CreateSuggestionDto,
    examples: {
      example1: {
        value: {
          name: 'John Doe',
          surName: 'Doe',
          message: 'This is a suggestion message.',
        },
      },
    },
  })
  create(@Body() createSuggestionDto: CreateSuggestionDto) {
    return this.suggestionsService.create(createSuggestionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all suggestions with pagination and optional name filter',
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
    return this.suggestionsService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single suggestion by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the suggestion',
    type: Number,
    example: 1,
  })
  findOne(@Param('id') id: string) {
    return this.suggestionsService.findOne(+id);
  }

  @RoleDec(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a suggestion by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the suggestion to update',
    type: Number,
    example: 1,
  })
  @ApiBody({
    description: 'Update suggestion payload',
    type: UpdateSuggestionDto,
    examples: {
      example1: {
        value: {
          name: 'Updated Name',
          surName: 'Updated SurName',
          message: 'Updated message text.',
        },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateSuggestionDto: UpdateSuggestionDto,
  ) {
    return this.suggestionsService.update(+id, updateSuggestionDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a suggestion by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the suggestion to delete',
    type: Number,
    example: 1,
  })
  remove(@Param('id') id: string) {
    return this.suggestionsService.remove(+id);
  }
}
