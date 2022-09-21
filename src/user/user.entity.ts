import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import * as argon2 from 'argon2';
import { ArticleEntity } from '../article/article.entity';
import { Exclude } from 'class-transformer';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
	unique: true
  })
  username: string;

  @Column({
	unique: true
  })
  email: string;

  @Column({ default: 'I am awesome!' })
  bio: string;

  @Column({ default: 'https://placekitten.com/640/360' })
  image: string;

  @Column({ select: false })
  @Exclude({ toPlainOnly: true })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @ManyToMany((type) => ArticleEntity)
  @JoinTable()
  favorites: ArticleEntity[];

  @OneToMany((type) => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

}
