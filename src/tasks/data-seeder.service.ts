import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UniversitiesRepository } from '../universities/universities.repository';
import axios from 'axios';

@Injectable()
export class DataSeederService implements OnModuleInit {
  private readonly logger = new Logger(DataSeederService.name);
  private readonly dataSourceUrl = 'https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json';

  constructor(private universitiesRepository: UniversitiesRepository) {}

  async onModuleInit() {
    await this.seedUniversities();
  }

  async seedUniversities() {
    try {
      const count = await this.universitiesRepository.countAll();
      if (count > 0) {
        this.logger.log(`Database already contains ${count} universities. Skipping seeding.`);
        return;
      }

      this.logger.log('Downloading university data...');
      const response = await axios.get(this.dataSourceUrl);
      const universities = response.data;

      this.logger.log(`Inserting ${universities.length} universities into database...`);
      const inserted = await this.universitiesRepository.createMany(universities);
      this.logger.log(`${inserted} universities successfully inserted.`);
    } catch (error) {
      this.logger.error(`Error loading data: ${error.message}`);
    }
  }
}
