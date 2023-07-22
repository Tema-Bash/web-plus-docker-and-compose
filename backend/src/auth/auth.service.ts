import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private hashService: HashService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOne({ where: { username } });
    if (user && user.password) {
      const isVerified = await this.hashService.compare(pass, user.password);
      return isVerified ? user : null;
    }
    return null;
  }

  login(user: User) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '24h' }),
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}
