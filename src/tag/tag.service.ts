import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TagEntity } from './tag.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from './dtos/create-tag.dto';
import * as slug from 'slug';
import { UpdateTagDto } from './dtos/update-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async create(tagData: CreateTagDto) {
    const tagSlug = this.slugify(tagData.name);
    const existingTag = await this.tagRepository.findOneBy({ slug: tagSlug });
    if (existingTag) {
      throw new HttpException(
        {
          message: 'Tag already exists',
          errors: ['Input data validation failed'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newTag = this.tagRepository.create({ ...tagData, slug: tagSlug });
    const savedTag = await this.tagRepository.save(newTag);
    return savedTag;
  }

  async findAll() {
    return this.tagRepository.find();
  }

  async update(id: number, updateData: UpdateTagDto) {
    const tag = await this.tagRepository.findOneBy({ id });
    if (!tag) {
      throw new HttpException(
        {
          message: 'No Tag exists',
          errors: ['Input data validation failed'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (Object.keys(updateData).length === 0) {
      throw new HttpException(
        {
          message: 'Nothing to update',
          errors: ['Input data validation failed'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (updateData.name) {
      updateData['slug'] = this.slugify(updateData.name);

      const checkTag = await this.tagRepository.findOneBy({
        slug: updateData['slug'],
      });
      if (checkTag && checkTag.id !== id) {
        throw new HttpException(
          {
            message: 'Tag Already Exists',
            errors: ['Input data validation failed'],
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const updatedTagData = { ...tag, ...updateData };

    return await this.tagRepository.update(updatedTagData.id, updatedTagData);
  }

  slugify(name: string) {
    return slug(name);
  }
}
