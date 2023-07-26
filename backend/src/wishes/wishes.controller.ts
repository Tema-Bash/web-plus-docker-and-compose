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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { ReqUser } from 'src/users/users.decorator';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(req.user.id, createWishDto);
  }

  @Get('last')
  getLastWishes() {
    return this.wishesService.findLast();
  }

  @Get('top')
  getTopWishes() {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.wishesService.findOneById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    await this.wishesService.update(Number(id), req.user.id, updateWishDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.wishesService.remove(+id, req.user.id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post(':id/copy')
  // copyWish(@Req() req, @Param('id') id: string) {
  //   return this.wishesService.copyWish(req.user, id);
  // }
  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copy(@ReqUser() user: User, @Param('id') id: string) {
    this.wishesService.copyWish(+id, user);
    return {};
  }
}
