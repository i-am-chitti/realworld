import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/user/user.decorator';
import { ArticleService } from './article.service';
import { ArticlesQueryDto } from './dtos/articles-query.dto';
import { CreateArticleDto } from './dtos/create-article.dto';

@Controller('articles')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@ApiOperation({ summary: "Get all articles" })
	@Get()
	async findAll(@Query() query: ArticlesQueryDto) {
		return this.articleService.findAll(query);
	}

	@ApiOperation({summary: "Create an article"})
	@ApiResponse({ status: 201, description: 'The article has been successfully created.'})
  	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@Post()
	async create(@User('id') userId: number, @Body() articleData: CreateArticleDto) {
		return this.articleService.create(userId, articleData);
	}
}
