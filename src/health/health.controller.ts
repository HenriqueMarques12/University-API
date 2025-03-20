import { Controller, Get } from '@nestjs/common';
import { 
  HealthCheckService, 
  HttpHealthIndicator, 
  MongooseHealthIndicator,
  HealthCheck
} from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: MongooseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('mongodb'),
      
      () => this.http.pingCheck('api', 'http://localhost:3000/api/docs'),
    ]);
  }
}
