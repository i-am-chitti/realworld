import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/user/auth.middleware';
import { UserEntity } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { FollowsEntity } from './follows.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowsEntity]), UserModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({
        path: 'profiles/:username/follow',
        method: RequestMethod.ALL,
      });
  }
}
