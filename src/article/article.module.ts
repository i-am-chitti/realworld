import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { UserEntity } from 'src/user/user.entity';
import { CommentEntity } from './comment.entity';
import { AuthMiddleware } from 'src/user/auth.middleware';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, UserEntity, CommentEntity]),
	UserModule
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes({path: 'articles', method: RequestMethod.POST});
	}
}
