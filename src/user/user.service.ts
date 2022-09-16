import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(userData: RegisterUserDto) {
    const { username, email } = userData;

    const users = await this.userRepository.findBy([{ username }, { email }]);

    if (users.length > 0) {
      const errors = [{ username: 'Username and email must be unique.' }];
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

	const newUser = this.userRepository.create(userData);

	const savedUser = this.userRepository.save(newUser);
	return savedUser;
  }

}
