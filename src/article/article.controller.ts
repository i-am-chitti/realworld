import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/user/user.decorator';
import { ArticleService } from './article.service';
import { ArticlesQueryDto } from './dtos/articles-query.dto';
import { CommentsQueryDto } from './dtos/comments-query.dto';
import { CreateArticleDto } from './dtos/create-article.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { DeleteCommentDto } from './dtos/delete-comment.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: 'Get all articles' })
  @Get()
  async findAll(@Query() query: ArticlesQueryDto) {
    return this.articleService.findAll(query);
  }

  @ApiOperation({ summary: 'Get an article by slug' })
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return await this.articleService.findOne(slug);
  }

  @ApiOperation({ summary: 'Create an article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(
    @User('id') userId: number,
    @Body() articleData: CreateArticleDto,
  ) {
    return this.articleService.create(userId, articleData);
  }

  @ApiOperation({ summary: 'Update article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully updated.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':slug')
  async update(@User('id') userId: number, @Param('slug') slug: string, @Body() articleData: CreateArticleDto) {
    // Todo: update slug also when title gets changed
    return this.articleService.update(userId, slug, articleData);
  }

  @ApiOperation({ summary: 'Delete article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug')
  async delete(@User('id') userId: number, @Param('slug') slug: string) {
    return this.articleService.delete(userId, slug);
  }

  @ApiOperation({ summary: 'Add a comment to an article' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/comments')
  async createComment(
    @Param('slug') slug: string,
    @Body() commentData: CreateCommentDto,
  ) {
    return await this.articleService.addComment(slug, commentData);
  }

  @Get(':slug/comments')
  async getAllComments(
    @Param('slug') slug: string,
    @Query() query: CommentsQueryDto,
  ) {
    return this.articleService.findAllComments(slug, query);
  }

  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug/comments/:id')
  async deleteComment(@Param() params: DeleteCommentDto) {
    const { slug, id } = params;
    return await this.articleService.deleteComment(slug, id);
  }
}
