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

  findOneById(id: number) {
    const wish = this.wishRepository.findOne({
      relations: {
        owner: { wishes: true, wishlists: true, offers: true },
        offers: { user: true },
      },
      where: { id },
    });
    if (wish) {
      throw new NotFoundException(`Такой подарок не существует`);
    } else {
      return wish;
    }
  }

  findMany(ids: FindManyOptions<Wish>) {
    return this.wishRepository.find(ids);
  }

  async update(id: number, userId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findOneById(Number(id));
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
    const wish = await this.findOneById(Number(id));

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Удалять можно только свои подарки');
    }

    return this.wishRepository.delete({ id });
  }

  async copyWish(user, id) {
    const wish = await this.findOneById(Number(id));

    const { name, link, price } = wish;

    const isExist = Boolean(
      await this.wishRepository.findOne({
        where: {
          name,
          link,
          price,
          owner: { id: user.id },
        },
        relations: { owner: true },
      }),
    );

    if (isExist) {
      throw new ForbiddenException('Вы уже копировали себе этот подарок');
    }

    await this.update(wish.id, user.id, {
      copied: wish.copied++,
    });

    delete wish.id;
    delete wish.createdAt;
    delete wish.updatedAt;
    return this.create(user, { ...wish });
  }
}
