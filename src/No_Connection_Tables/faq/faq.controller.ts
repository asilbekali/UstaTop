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
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { AuthGuard } from '../Guards/auth.guard';
import { RoleDec } from '../user/decorator/roles.decorator';
import { Role } from '../user/enum/role.enum';
import { RolesGuard } from '../Guards/roles.guard';

@UseGuards(AuthGuard)
@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new FAQ' })
  @ApiBody({
    description: 'FAQ creation payload',
    type: CreateFaqDto,
    examples: {
      example1: {
        summary: 'Sample FAQ creation',
        value: {
          question: 'What is NestJS?',
          answer: 'NestJS is a progressive Node.js framework.',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'FAQ successfully created',
    schema: {
      example: {
        id: 1,
        question: 'What is NestJS?',
        answer: 'NestJS is a progressive Node.js framework.',
      },
    },
  })
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.create(createFaqDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all FAQs with optional pagination and filters',
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
    name: 'question',
    required: false,
    type: String,
    description: 'Filter by question',
  })
  @ApiQuery({
    name: 'answer',
    required: false,
    type: String,
    description: 'Filter by answer',
  })
  @ApiResponse({
    status: 200,
    description: 'List of FAQs with pagination',
    schema: {
      example: {
        data: [
          {
            id: 1,
            question: 'What is NestJS?',
            answer: 'NestJS is a progressive Node.js framework.',
          },
          {
            id: 2,
            question: 'How to use Prisma with NestJS?',
            answer: 'Prisma can be integrated as a service provider.',
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
      },
    },
  })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('question') question?: string,
    @Query('answer') answer?: string,
  ) {
    return this.faqService.findAll({ page, limit, question, answer });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific FAQ by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'FAQ ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'FAQ found',
    schema: {
      example: {
        id: 1,
        question: 'What is NestJS?',
        answer: 'NestJS is a progressive Node.js framework.',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  findOne(@Param('id') id: string) {
    return this.faqService.findOne(+id);
  }

  @RoleDec(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific FAQ by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'FAQ ID',
    example: 1,
  })
  @ApiBody({
    description: 'FAQ update payload',
    type: UpdateFaqDto,
    examples: {
      example1: {
        summary: 'Update FAQ answer',
        value: {
          answer: 'Updated answer text',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'FAQ successfully updated',
    schema: {
      example: {
        id: 1,
        question: 'What is NestJS?',
        answer: 'Updated answer text',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqService.update(+id, updateFaqDto);
  }

  @RoleDec(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific FAQ by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'FAQ ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'FAQ successfully deleted',
    schema: {
      example: {
        message: 'FAQ deleted successfully',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'FAQ not found' })
  remove(@Param('id') id: string) {
    return this.faqService.remove(+id);
  }
}
