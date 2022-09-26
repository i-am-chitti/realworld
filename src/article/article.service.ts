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
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentsQueryDto } from './dtos/comments-query.dto';

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

  async findOne(slug: string) {
    let article = await this.articleRepository.findOneBy({ slug });
    if (!article) {
      throw new HttpException(
        {
          message: 'Article with given slug does not exist',
          errors: 'Data input validation failed',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return article;
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
        tags: await this.findTags(articleData.tags),
      }),
    });
    const savedArticle = this.articleRepository.save(newArticle);
    return savedArticle;
  }

  async findTags(tags: number[]) {
    return await this.tagRepository.findBy({ id: In(tags) });
  }

  async update(userId: number, slug: string, articleData: CreateArticleDto) {
    let toUpdate = await this.findOne(slug);

    if (toUpdate.author.id !== userId) {
      throw new HttpException(
        {
          message: 'No sufficient permission to update this article',
          errors: ['Insufficient permission'],
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    let updatedArticleData = {
      ...toUpdate,
      articleData,
      tags:
        articleData.tags?.length > 0
          ? await this.findTags(articleData.tags)
          : [],
    };
    const updatedaArticle = await this.articleRepository.save(
      updatedArticleData,
    );
    return updatedaArticle;
  }

  async delete(userId: number, slug: string) {
    let article = await this.findOne(slug);
    if (article.author.id !== userId) {
      throw new HttpException(
        {
          message: 'No sufficient permission to delete this article',
          errors: ['Insufficient permission'],
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return await this.articleRepository.delete({ slug });
  }

  async addComment(slug: string, commentData: CreateCommentDto) {
    let article = await this.findOne(slug);

    const newComment = this.commentRepository.create({
      ...commentData,
      article,
    });
    const savedComment = await this.commentRepository.save(newComment);
    article.comments.push(savedComment);
    return savedComment;
  }

  async deleteComment(slug: string, id: number) {
    let article = await this.findOne(slug);

    const comment = await this.commentRepository.findOneBy({ id });
    const deleteIndex = article.comments.findIndex(
      (_comment) => _comment.id === comment.id,
    );

    if (deleteIndex >= 0) {
      const deleteComments = article.comments.splice(deleteIndex, 1);
      await this.commentRepository.delete(deleteComments[0].id);
      article = await this.articleRepository.save(article);
      return deleteComments[0];
    } else {
      throw new HttpException(
        {
          message: 'Comment does not exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllComments(slug: string, query: CommentsQueryDto) {
    let article = await this.findOne(slug);
    //TODO - Paginate comments
    return article.comments;
  }

  slugify(title: string) {
    return (
      slug(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
