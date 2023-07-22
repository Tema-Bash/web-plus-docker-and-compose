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
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto, @Req() req) {
    return this.wishlistsService.create(req.user.id, createWishlistDto);
  }

  @Get()
  getWishlists() {
    return this.wishlistsService.getWishlists();
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
