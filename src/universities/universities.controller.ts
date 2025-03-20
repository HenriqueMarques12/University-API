import { Controller, Get, Param, Query, Put, Body, HttpCode } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { SearchUniversityDto } from './dto/search-university.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('universities')
@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Get()
  @ApiOperation({ summary: 'List or search universities' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of universities retrieved successfully'
  })
  async findAll(@Query() query: SearchUniversityDto) {
    return this.universitiesService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a university by ID' })
  @ApiParam({ name: 'id', description: 'University ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'University found'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'University not found'
  })
  async findOne(@Param('id') id: string) {
    return this.universitiesService.findById(id);
  }

  @Put(':id/quote')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a university quote' })
  @ApiParam({ name: 'id', description: 'University ID' })
  @ApiBody({
    type: UpdateQuoteDto,
    description: 'New quote value'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Quote updated successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'University not found'
  })
  async updateQuote(
    @Param('id') id: string,
    @Body() updateQuoteDto: UpdateQuoteDto
  ) {
    return this.universitiesService.updateQuote(id, updateQuoteDto.value);
  }

  @Get('quotes/latest')
  @ApiOperation({ summary: 'Get latest quotes' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of recent quotes retrieved successfully'
  })
  async getLatestQuotes() {
    return this.universitiesService.getLatestQuotes();
  }

  @Get(':id/quote')
  @ApiOperation({ summary: 'Get quote for a specific university' })
  @ApiParam({ name: 'id', description: 'University ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Quote found' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Quote not found' 
  })
  async getUniversityQuote(@Param('id') id: string) {
    return this.universitiesService.getUniversityQuote(id);
  }
}
