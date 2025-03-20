import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UniversitiesController } from './universities.controller';
import { UniversitiesService } from './universities.service';
import { UniversitiesRepository } from './universities.repository';
import { University, UniversitySchema } from './schemas/university.schema';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: University.name, schema: UniversitySchema },
    ]),
    CacheModule,
  ],
  controllers: [UniversitiesController],
  providers: [UniversitiesService, UniversitiesRepository],
  exports: [UniversitiesService, UniversitiesRepository],
})
export class UniversitiesModule {}
