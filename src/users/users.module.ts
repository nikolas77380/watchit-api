import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from 'src/entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [SequelizeModule.forFeature([UserEntity])],
})
export class UsersModule {}
