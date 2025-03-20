import { Injectable, Logger } from '@nestjs/common';


@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly startTime: Date;

  constructor() {
    this.startTime = new Date();
    this.logger.log('AppService initialized');
  }


  getHello(): string {
    this.logger.debug('getHello method called');
    return 'Hello World!';
  }


  getAppInfo(): {
    name: string;
    version: string;
    description: string;
    uptime: string;
  } {
    const uptimeMs = Date.now() - this.startTime.getTime();
    const uptime = this.formatUptime(uptimeMs);

    this.logger.debug('getAppInfo method called');

    return {
      name: 'API de Universidades',
      version: '1.0.0',
      description: 'API para consulta e gerenciamento de informações sobre universidades',
      uptime,
    };
  }


  getHealthStatus(): {
    status: 'ok' | 'error';
    timestamp: string;
    environment: string;
  } {
    this.logger.debug('getHealthStatus method called');

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }


  private formatUptime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
  }
}
