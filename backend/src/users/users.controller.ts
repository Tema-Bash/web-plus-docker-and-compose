import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsString } from 'class-validator';
import { RequestUser } from 'src/auth/auth.controller';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FindUsersDto } from './dto/find-user.dto';
import { User } from './entities/user.entity';
import { ReqUser } from './users.decorator';

export class FindUserDto {
  @IsString()
  query: string;
}

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): any {
    return this.usersService.findAll();
  }

  @Get('me')
  getUser(@Req() req: RequestUser) {
    return this.usersService.findById(req.user.id);
  }

  @Patch('me')
  async updateProfile(
    @ReqUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateOne(user.id, updateUserDto);
  }

  @Get('me/wishes')
  getProfileWishes(@ReqUser() user: User) {
    return this.usersService.getUserWishesById(user.id);
  }

  @Get(':username')
  getByUsername(@Param('username') username: string) {
    return this.usersService.getUserByUsername(username);
  }

  @Get(':username/wishes')
  getUserWishes(@Param('username') username: string) {
    return this.usersService.getSomeUserWishes(username);
  }

  @Post('find')
  getByUserNameOrEmail(@Body() findUsersDto: FindUsersDto) {
    return this.usersService.getByUsernameOrEmail(findUsersDto);
  }
}
