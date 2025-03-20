import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UniversitiesModule } from './universities/universities.module';
import { CacheModule } from './cache/cache.module';
import { DataSeederService } from './tasks/data-seeder.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UniversitiesModule,
    CacheModule,
    HealthModule,

  ],
  controllers: [AppController],
  providers: [AppService, DataSeederService],
})
export class AppModule {}
