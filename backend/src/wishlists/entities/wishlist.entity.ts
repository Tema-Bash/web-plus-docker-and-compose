import {
  IsInt,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  @IsInt()
  @Min(0)
  id: number;

  @CreateDateColumn()
  createdAt: Date; //дата создания, тип значения Date

  @UpdateDateColumn()
  updatedAt: Date; //дата изменения, тип значения

  @Column()
  @Length(1, 250)
  name: string; // название списка.  Не может быть длиннее 250 символов и короче одного

  @Column({ default: '' })
  @MaxLength(1500)
  description: string; //описание подборки, строка до 1500 символов

  @Column()
  @IsUrl()
  image: string; //обложка для подборки

  @ManyToMany(() => Wish, (wish) => wish)
  @JoinTable()
  items: Wish[]; //содержит набор ссылок на подарки

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User; //ссылка на пользователя, который добавил свой вишлист.
}
