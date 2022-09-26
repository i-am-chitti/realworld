import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { DeleteResult, Repository, Like, In } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { UserEntity } from 'src/user/user.entity';
import { CreateArticleDto } from './dtos/create-article.dto';
import * as slug from 'slug';
import { ArticlesQueryDto } from './dtos/articles-query.dto';
import { TagEntity } from 'src/tag/tag.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async findAll(query: ArticlesQueryDto) {
    let authorId = null;

    if (query.author) {
      const author = await this.userRepository.findOneBy({
        username: query.author,
      });
      if (author) {
        authorId = author.id;
      }
    }

    let tags: TagEntity[] = [];
    if (query.tags) {
      tags = await this.tagRepository.findBy({ slug: In(query.tags) });

      if (tags.length === 0) {
        throw new HttpException(
          {
            message: 'Some tags do not exist',
            errors: ['Input data validation failed'],
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const [items, count] = await this.articleRepository.findAndCount({
      relations: ['author', 'tags'],
      order: {
        created: 'DESC',
      },
      ...(query.offset &&
        query.limit && {
          skip: query.offset,
          take: query.limit,
        }),
      where: {
        ...(authorId && { author: authorId }),
        ...(tags.length > 0 && {
          tags,
        }),
      },
    });
    return {
      items,
      count,
    };
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
      author: user,
      ...(articleData.tags && {
        tags: await this.tagRepository.findBy({ id: In(articleData.tags) }),
      }),
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
