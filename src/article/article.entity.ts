import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  BeforeUpdate,
  JoinTable,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { CommentEntity } from './comment.entity';
import { TagEntity } from '../tag/tag.entity';

@Entity('article')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }

  @ManyToMany(() => TagEntity)
  @JoinTable()
  tags: TagEntity[];

  @ManyToOne((type) => UserEntity, (user) => user.articles)
  author: UserEntity;

  @OneToMany((type) => CommentEntity, (comment) => comment.article, {
    eager: true,
  })
  @JoinColumn()
  comments: CommentEntity[];

  @Column({ default: 0 })
  favoriteCount: number;
}
