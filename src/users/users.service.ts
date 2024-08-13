import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { UserEntity } from 'src/entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserEntity)
    private userRepository: typeof UserEntity,
  ) {}
  async findOneBy(email: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }
  async create(createUserDto: CreateUserDto) {
    return this.userRepository.create({
      ...createUserDto,
      createdAt: new Date(),
    });
  }
}
