import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from 'src/hash/hash.service';
import { error } from 'console';
import { FindUsersDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashService: HashService,
  ) {}
  async findAll() {
    return this.usersRepository.find();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, password } = createUserDto;
    const user = await this.findOne({ where: [{ email }, { username }] });

    if (user) {
      throw new HttpException('User already exist', HttpStatus.NOT_FOUND);
    }
    const hashedPassword = await this.hashService.getHashedPassword(password);

    return this.usersRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findOne(query) {
    return this.usersRepository.findOne(query);
  }

  async findMany(query) {
    return this.usersRepository.find(query);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { email, username, password } = updateUserDto;
    const user = await this.usersRepository.findOne({ where: { id } });
    const isExist = Boolean(
      await this.findOne({
        where: [{ email }, { username }],
      }),
    );
    if (isExist)
      throw new ConflictException(
        `Пользователь с таким email или username уже зарегистрирован`,
      );
    if (password) {
      updateUserDto.password = await this.hashService.getHashedPassword(
        password,
      );
    }
    try {
      await this.usersRepository.update({ id }, { ...user, ...updateUserDto });
      return this.findOne({ where: { id } });
    } catch (err) {
      throw new BadRequestException(`${error}`);
    }
  }

  async getCurrentUserWishes(userId: number) {
    return this.findOne({
      where: { id: userId },
      relations: {
        wishes: { owner: true },
      },
    }).then((user) => user.wishes);
  }

  async getUserByUsername(username: string) {
    return this.findOne({
      where: { username },
    });
  }

  getSomeUserWishes(username: string) {
    return this.findOne({
      where: { username },
      relations: {
        wishes: true,
      },
    }).then((user) => user.wishes);
  }

  async getByUsernameOrEmail(findUsersDto: FindUsersDto) {
    const { query } = findUsersDto;
    return this.findMany({
      where: [{ username: query }, { email: query }],
    });
  }
}
