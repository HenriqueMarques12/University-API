import { Injectable, NotFoundException } from '@nestjs/common';
import { UniversitiesRepository } from './universities.repository';
import { University } from './schemas/university.schema';
import { SearchUniversityDto } from './dto/search-university.dto';

@Injectable()
export class UniversitiesService {
  constructor(private universitiesRepository: UniversitiesRepository) {}

  async findAll(page = 1, limit = 20): Promise<{ 
    data: University[]; 
    total: number; 
    page: number; 
    limit: number 
  }> {
    const data = await this.universitiesRepository.findAll(page, limit);
    const total = await this.universitiesRepository.countAll();
    return { data, total, page, limit };
  }

  async search(searchParams: SearchUniversityDto): Promise<{ 
    data: University[]; 
    total: number; 
    page: number; 
    limit: number 
  }> {
    const page = searchParams.page || 1;
    const limit = searchParams.limit || 20;

    let data: University[];
    let total: number;

    if (searchParams.name) {
      data = await this.universitiesRepository.findByName(searchParams.name, page, limit);
      total = await this.universitiesRepository.countByName(searchParams.name);
    } else if (searchParams.country) {
      data = await this.universitiesRepository.findByCountry(searchParams.country, page, limit);
      total = await this.universitiesRepository.countByCountry(searchParams.country);
    } else {
      data = await this.universitiesRepository.findAll(page, limit);
      total = await this.universitiesRepository.countAll();
    }

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<University> {
    const university = await this.universitiesRepository.findById(id);
    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
    return university;
  }

  async updateQuote(id: string, quoteValue: number): Promise<University> {
    const university = await this.universitiesRepository.updateQuote(id, quoteValue);
    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
    return university;
  }

  async getLatestQuotes() {
    return this.universitiesRepository.getLatestQuotes();
  }
  
  async getUniversityQuote(id: string) {
    const quote = await this.universitiesRepository.getUniversityQuote(id);
    if (!quote) {
      throw new NotFoundException(`Quote for university ID ${id} not found`);
    }
    return quote;
  }
}
