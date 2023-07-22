import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { RequestUser } from 'src/auth/auth.controller';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @Req() req: RequestUser) {
    return this.offersService.createOffer(createOfferDto, req.user);
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
