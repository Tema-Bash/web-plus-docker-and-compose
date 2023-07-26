import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { In, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from 'src/users/entities/user.entity';
import { ReqUser } from 'src/users/users.decorator';
@Injectable()
@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  async create(
    @ReqUser() user: User,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return await this.wishlistsService.create(user.id, createWishlistDto);
  }

  @Get()
  async getWishLists() {
    const wishlists = await this.wishlistsService.getWishlists();
    wishlists.forEach((item) => {
      delete item.owner.password;
      delete item.owner.email;
    });
    return wishlists;
  }

  @Get(':id')
  getWishListById(@Param('id') id: string) {
    return this.wishlistsService.getWishListById(Number(id));
  }

  @Patch(':id')
  updateWishList(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req,
  ) {
    return this.wishlistsService.update(
      Number(id),
      updateWishlistDto,
      req.user.id,
    );
  }

  @Delete(':id')
  removeWishList(@Param('id') id: string, @Req() req) {
    return this.wishlistsService.delete(Number(id), req.user.id);
  }
}
