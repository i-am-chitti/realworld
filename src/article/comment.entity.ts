import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ArticleEntity } from './article.entity';

@Entity('comment')
export class CommentEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  //TODO - add commentator column

  @ManyToOne((type) => ArticleEntity, (article) => article.comments)
  article: ArticleEntity;
}
