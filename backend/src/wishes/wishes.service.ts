import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm/repository/Repository';

import { FindManyOptions } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  create(ownerId: number, createWishDto: CreateWishDto) {
    return this.wishRepository.save({
      ...createWishDto,
      owner: { id: ownerId },
    });
  }

  findLast() {
    return this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  findTop() {
    return this.wishRepository.find({
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  async findWish(id: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: { user: true },
      },
    });
    if (!wish) {
      throw new NotFoundException(`Такой подарок не существует`);
    } else {
      return wish;
    }
  }

  findOneById(id: number) {
    const wish = this.wishRepository.findOne({
      relations: {
        owner: { wishes: true, wishlists: true, offers: true },
        offers: { user: true },
      },
      where: { id },
    });
    if (!wish) {
      throw new NotFoundException(`Такой подарок не существует`);
    } else {
      return wish;
    }
  }

  findMany(ids: FindManyOptions<Wish>) {
    return this.wishRepository.find(ids);
  }

  async update(id: number, userId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findWish(Number(id));
    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Подарок не для вас');
    } else if (wish.raised > 0) {
      throw new BadRequestException(
        'Вы не можете изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }
    return { ...wish, ...updateWishDto };
  }

  async remove(id: number, userId: number) {
    const wish = await this.findWish(Number(id));

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Удалять можно только свои подарки');
    }

    return this.wishRepository.delete({ id });
  }

  async copyWish(id: number, user: User) {
    const wish = await this.findWish(id);
    await this.wishRepository.update(id, { copied: wish.copied + 1 });
    const { name, link, image, price, description } = wish;
    const copiedWish = await this.wishRepository.create({
      name,
      link,
      image,
      price,
      description,
      raised: 0,
      owner: user,
    });
    return await this.wishRepository.save(copiedWish);
  }

  updateRaisedAmount(wish: Wish, amount: number) {
    return this.wishRepository.update(
      { id: wish.id },
      { raised: wish.raised + amount },
    );
  }
}
