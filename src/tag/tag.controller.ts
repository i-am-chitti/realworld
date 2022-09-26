import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTagDto } from './dtos/create-tag.dto';
import { UpdateTagDto, UpdateTagPram } from './dtos/update-tag.dto';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {

	constructor(private readonly tagService: TagService) {}

	@Post()
	async create(@Body() tagData: CreateTagDto) {
		return this.tagService.create(tagData);
	}

	@Get()
	async findAll() {
		return this.tagService.findAll();
	}

	@Patch(':id')
	async update(@Param() params: UpdateTagPram, @Body() updateData: UpdateTagDto) {
		return this.tagService.update(params.id, updateData);
	}
}
