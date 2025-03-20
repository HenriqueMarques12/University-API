import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { University, UniversityDocument } from './schemas/university.schema';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class UniversitiesRepository {
  private readonly logger = new Logger(UniversitiesRepository.name);
  private readonly QUOTE_CACHE_KEY = 'university_latest_quote';
  
  constructor(
    @InjectModel(University.name) private universityModel: Model<UniversityDocument>,
    private cacheService: CacheService,
  ) {}

  async findAll(page = 1, limit = 20): Promise<University[]> {
    return this.universityModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findById(id: string): Promise<University | null> {
    return this.universityModel.findById(id).exec();
  }

  async findByName(name: string, page = 1, limit = 20): Promise<University[]> {
    return this.universityModel
      .find({ $text: { $search: name } })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findByCountry(country: string, page = 1, limit = 20): Promise<University[]> {
    return this.universityModel
      .find({ country: new RegExp(country, 'i') })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async countAll(): Promise<number> {
    return this.universityModel.countDocuments().exec();
  }

  async countByName(name: string): Promise<number> {
    return this.universityModel
      .countDocuments({ $text: { $search: name } })
      .exec();
  }

  async countByCountry(country: string): Promise<number> {
    return this.universityModel
      .countDocuments({ country: new RegExp(country, 'i') })
      .exec();
  }

  async updateQuote(universityId: string, quoteValue: number): Promise<University | null> {
    const university = await this.universityModel.findByIdAndUpdate(
      universityId,
      { 
        lastQuoteValue: quoteValue,
        lastQuoteUpdate: new Date() 
      },
      { new: true }
    ).exec();
    
    if (university) {
      await this.cacheService.set(
        `${this.QUOTE_CACHE_KEY}_${universityId}`, 
        {
          value: quoteValue,
          updatedAt: new Date(),
          universityName: university.name
        },
        3600 
      );
      
      const latestQuotes = await this.cacheService.get<any[]>(this.QUOTE_CACHE_KEY) || [];
      latestQuotes.unshift({
        universityId,
        universityName: university.name,
        value: quoteValue,
        updatedAt: new Date()
      });
      
      await this.cacheService.set(
        this.QUOTE_CACHE_KEY,
        latestQuotes.slice(0, 10),
        86400
      );
    }
    
    return university;
  }

  async getLatestQuotes(): Promise<any[]> {
    return await this.cacheService.get<any[]>(this.QUOTE_CACHE_KEY) || [];
  }
  
  async getUniversityQuote(universityId: string): Promise<any> {
    const cachedQuote = await this.cacheService.get<any>(`${this.QUOTE_CACHE_KEY}_${universityId}`);
    
    if (cachedQuote) {
      this.logger.log(`Quote retrieved from cache for university ${universityId}`);
      return cachedQuote;
    }
    
    const university = await this.universityModel.findById(universityId).exec();
    if (!university) {
      return null;
    }
    
    const quoteData = {
      value: university.lastQuoteValue,
      updatedAt: university.lastQuoteUpdate,
      universityName: university.name
    };
    
    await this.cacheService.set(
      `${this.QUOTE_CACHE_KEY}_${universityId}`,
      quoteData,
      3600
    );
    
    return quoteData;
  }

  async createMany(universities: Partial<University>[]): Promise<number> {
    const result = await this.universityModel.insertMany(universities);
    return result.length;
  }
}
