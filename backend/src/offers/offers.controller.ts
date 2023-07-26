import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { RequestUser } from 'src/auth/auth.controller';
import { ReqUser } from 'src/users/users.decorator';
import { User } from 'src/users/entities/user.entity';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  // @Post()
  // create(@Body() createOfferDto: CreateOfferDto, @Req() req: RequestUser) {
  //   return this.offersService.createOffer(createOfferDto, req.user);
  // }
  @Post()
  async create(@ReqUser() user: User, @Body() createOfferDto: CreateOfferDto) {
    await this.offersService.create(user, createOfferDto);
    return {};
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.offersService.getById(id);
  }

  @Get()
  getOffers() {
    return this.offersService.getAll();
  }
}
