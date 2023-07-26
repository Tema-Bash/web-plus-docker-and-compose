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

  async findById(id: number, password = false): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect(password ? 'user.password' : '')
      .where('user.id = :id', { id })
      .getOne();
    return user;
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

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const hashedPassword = await this.hashService.getHashedPassword(
        updateUserDto.password,
      );
      updateUserDto = { ...updateUserDto, password: hashedPassword };
    }
    await this.usersRepository.update(id, updateUserDto);
    return this.findOneById(id);
  }

  async findOneById(id: number) {
    const user = this.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('такой пользователь не существует');
    }
    return user;
  }

  async getUserWishesById(id: number) {
    const user = await this.findOne({
      where: { id },
      relations: {
        wishes: { owner: true, offers: true },
      },
    });
    return user.wishes;
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
