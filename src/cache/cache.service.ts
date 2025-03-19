import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  
  async get<T>(key: string): Promise<T | undefined> {
    try {
      const result = await this.cacheManager.get<T>(key);
      return result === null ? undefined : result;
    } catch (error) {
      this.logger.error(`Error retrieving value from cache: ${error.message}`);
      return undefined;
    }
  }
  
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
      this.logger.log(`Cache updated for key: ${key}`);
    } catch (error) {
      this.logger.error(`Error setting value in cache: ${error.message}`);
    }
  }
  
  async delete(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error(`Error deleting value from cache: ${error.message}`);
    }
  }
  
  async reset(): Promise<void> {
    try {
      await this.cacheManager.clear();
    } catch (error) {
      this.logger.error(`Error resetting cache: ${error.message}`);
    }
  }
}
