import { IsInt, IsPositive, IsString, Length, Min } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Wish {
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
  name: string; // название подарка. Не может быть длиннее 250 символов и короче одного.

  @Column()
  link: string; //ссылка на интернет-магазин, в котором можно приобрести подарок, строка.

  @Column()
  image: string; //ссылка на изображение подарка, строка. Должна быть валидным URL.

  @Column()
  @IsPositive()
  price: number; //стоимость подарка, с округлением до сотых, число.

  @Column({ default: 0 })
  @IsPositive()
  raised: number; //сумма предварительного сбора или сумма, которую пользователи сейчас готовы скинуть на подарок. Также округляется до сотых.

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User; //ссылка на пользователя, который добавил пожелание подарка.

  @Column({ type: 'varchar', length: 1024 })
  @IsString()
  @Length(1, 1024)
  description: string; //строка с описанием подарка длиной от 1 и до 1024 символов

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[]; //массив ссылок на заявки скинуться от других пользователей

  @Column('int', { default: 0 })
  @IsPositive()
  copied: number; //содержит cчётчик тех, кто скопировал подарок себе. Целое десятичное число
}
