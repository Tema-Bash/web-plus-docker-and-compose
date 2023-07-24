import { IsInt, IsString, Length, Min } from 'class-validator';
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

  @Column({ type: 'varchar', length: 250 })
  @IsString()
  @Length(1, 250)
  name: string; // название списка.  Не может быть длиннее 250 символов и короче одного

  @Column({ type: 'varchar', length: 1500,nullable: true  })
  @IsString()
  @Length(1, 1500)
  description: string; //описание подборки, строка до 1500 символов

  @Column()
  image: string; //обложка для подборки

  @ManyToMany(() => Wish, (wish) => wish)
  items: Wish[]; //содержит набор ссылок на подарки

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User; //ссылка на пользователя, который добавил свой вишлист.
}
