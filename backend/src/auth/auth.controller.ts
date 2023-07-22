import {
  Controller,
  Req,
  Request,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { IsString, Length, MinLength } from 'class-validator';

export interface RequestUser extends Request {
  user: User;
}

export class SigninUserDto {
  @IsString()
  @Length(1, 64)
  username: string;

  @IsString()
  @MinLength(2)
  password: string;
}

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Req() req: RequestUser) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.signUp(createUserDto);
  }
}
