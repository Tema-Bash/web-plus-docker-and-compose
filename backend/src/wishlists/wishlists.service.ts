import { InjectRepository } from '@nestjs/typeorm';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { Wishlist } from './entities/wishlist.entity';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from 'src/users/entities/user.entity';
import { In } from 'typeorm';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) {}

  async create(user: User, createDto: CreateWishlistDto) {
    const items = await this.findMany({
      where: { id: In(createDto.itemsId) },
    });

    delete createDto.itemsId;
    const list = await this.wishlistsRepository.save({
      owner: {
        id: user.id,
        username: user.username,
        about: user.about,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      items,
      ...createDto,
    });
    return list;
  }

  findMany(query: FindManyOptions<Wishlist>) {
    return this.wishlistsRepository.find(query);
  }

  findOne(query: FindOneOptions<Wishlist>) {
    return this.wishlistsRepository.findOne(query);
  }

  getWishlists() {
    return this.findMany({
      relations: {
        items: true,
        owner: true,
      },
    });
  }

  getWishListById(id: number) {
    const wishList = this.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });
    if (!wishList) {
      throw new NotFoundException('Wishlist не найден');
    }
    return wishList;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.getWishListById(id);

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Редактировать можно только свои списки');
    }

    const { itemsId, ...rest } = updateWishlistDto;
    const items = itemsId.map((id) => ({ id }));
    await this.wishlistsRepository.save({ id, items, ...rest });
    return this.getWishListById(wishlist.id);
  }

  async delete(id: number, userId: number) {
    const wishlist = await this.getWishListById(id);
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Удалить можно только свои списки подарков');
    }
    await this.wishlistsRepository.delete(id);
    return wishlist;
  }
}
