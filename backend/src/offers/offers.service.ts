import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository, DataSource } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @Inject(WishesService)
    private readonly wishesService: WishesService,
  ) {}

  getAll() {
    return this.offersRepository.find({
      where: {},
      relations: ['user', 'item'],
    });
  }

  async getById(id) {
    try {
      return await this.offersRepository.findOne({
        where: {
          id,
        },
        relations: ['item', 'user'],
      });
    } catch (error) {
      throw new NotFoundException(`Offer does not exist`);
    }
  }

  async create(user: User, createOfferDto: CreateOfferDto) {
    const { itemId, amount, hidden } = createOfferDto;
    const wish = await this.wishesService.findWish(itemId);

    if (user.id === wish.owner.id) {
      throw new BadRequestException(
        'Можно вносить деньги только на подарки для других',
      );
    } else if (amount + wish.raised > wish.price) {
      throw new BadRequestException(
        'Сумма вносимых средств не может превышать стоимость подарка',
      );
    }

    const newOffer = await this.offersRepository.create({
      amount,
      hidden,
      item: wish,
      user,
    });

    await this.wishesService.updateRaisedAmount(wish, amount);
    await this.offersRepository.save(newOffer);
    return newOffer;
  }
}
