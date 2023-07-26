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
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) {}

  async create(id: number, createWishlistDto: CreateWishlistDto) {
    const { name, description, image, itemsId } = createWishlistDto;
    const items = itemsId.map((id) => ({ id } as Wish));
    const wishlist = this.wishlistsRepository.create({
      name,
      description,
      image,
      items,
      owner: { id },
    });
    return await this.wishlistsRepository.save(wishlist);
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
