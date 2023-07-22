import { IsInt, IsPositive, Min } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  @IsInt()
  @Min(0)
  id: number;

  @CreateDateColumn()
  createdAt: Date; //дата создания, тип значения Date

  @UpdateDateColumn()
  updatedAt: Date; //дата изменения, тип значения

  @ManyToOne(() => User, (user) => user.offers)
  user: User; // содержит id желающего скинуться;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish; //содержит ссылку на товар;

  @Column()
  @IsPositive()
  amount: number; //сумма заявки, округляется до двух знаков после запятой

  @Column({ default: false })
  hidden: boolean; //флаг, который определяет показывать ли информацию о скидывающемся в списке. По умолчанию равен false
}
