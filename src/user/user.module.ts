import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { API_BASE_PREFIX } from 'src/utils/constants';
import { AuthMiddleware } from './auth.middleware';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
		`${API_BASE_PREFIX}/user/login`,
		`${API_BASE_PREFIX}/user/register`,
      )
      .forRoutes(UserController);
  }
}
