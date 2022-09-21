import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello! Welcome to realworld API. Explore different endpoints.';
  }
}
