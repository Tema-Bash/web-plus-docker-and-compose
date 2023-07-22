import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import {
  Column,
  OneToMany,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Length, IsEmail, IsInt, Min, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @IsInt()
  @Min(0)
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ nullable: true })
  createdAt: Date; //дата создания, тип значения Date

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date; //дата изменения, тип значения

  @Column({ unique: true })
  @IsString()
  @Length(2, 30)
  username: string; //уникальная строка от 2 до 30 символов, обязательное поле.

  @Column('text', { default: '«Пока ничего не рассказал о себе»' })
  @Length(2, 200)
  about?: string; // **информация о пользователе, строка от 2 до 200 символов. В качестве значения по умолчанию укажите для него строку: «Пока ничего не рассказал о себе».

  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar?: string; // ссылка на аватар. В качестве значения по умолчанию задайте https://i.pravatar.cc/300

  @Column({ unique: true })
  @IsEmail()
  email: string; //адрес электронной почты пользователя, должен быть уникален

  @Column({ select: true })
  @Exclude()
  password: string; // пароль пользователя, строка

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[]; //список желаемых подарков.

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[]; //содержит список подарков, на которые скидывается пользователь

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[]; //содержит список вишлистов, которые создал пользователь
}
