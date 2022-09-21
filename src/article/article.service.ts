import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { UserEntity } from 'src/user/user.entity';
import { CreateArticleDto } from './dtos/create-article.dto';
import * as slug from 'slug';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll() {
    return await this.articleRepository.find({ relations: ['author'] });
  }

  async create(userId: number, articleData: CreateArticleDto) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException({ message: 'User not exists' }, 404);
    }

    const slug = this.slugify(articleData.title);
    const newArticle = this.articleRepository.create({
      ...articleData,
      slug,
      tagList: articleData.tagList || [],
      author: user,
    });
    const savedArticle = this.articleRepository.save(newArticle);
    return savedArticle;
  }

  slugify(title: string) {
    return (
      slug(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
