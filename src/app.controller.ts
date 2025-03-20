import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { TemplateService } from './views/template.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly templateService: TemplateService,
  ) {}

  @Get()
  async getHomePage(@Res() res: Response): Promise<void> {
    const appInfo = this.appService.getAppInfo();
    const healthStatus = this.appService.getHealthStatus();
    
    const html = await this.templateService.render('home', {
      name: appInfo.name,
      version: appInfo.version,
      description: appInfo.description,
      uptime: appInfo.uptime,
      environment: healthStatus.environment,
      statusClass: healthStatus.status === 'ok' ? 'status-ok' : 'status-error',
      statusText: healthStatus.status === 'ok' ? 'Online' : 'Offline',
      timestamp: new Date(healthStatus.timestamp).toLocaleString('pt-BR'),
      currentYear: new Date().getFullYear(),
    });
    
    res.send(html);
  }
  
  @Get('health-status')
  getHealth() {
    return this.appService.getHealthStatus();
  }
  
  @Get('app-info')
  getAppInfo() {
    return this.appService.getAppInfo();
  }
}
