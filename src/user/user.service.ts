import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'class-validator';
import { DeleteResult, Repository } from 'typeorm';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './user.entity';
import { UserData, UserDbData } from './user.interface';
import * as argon2 from 'argon2';
import { LoginUserDto } from './dtos/login-user.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(loginData: LoginUserDto) {
    const user = await this.userRepository.findOneBy({
      username: loginData.username,
    });
    if (!user) return null;

    if (await argon2.verify(user.password, loginData.password)) {
      return user;
    }
    return null;
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findById(userId: number): Promise<UserEntity> | null {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) return null;
    return user;
  }

  async create(userData: RegisterUserDto): Promise<UserData> {
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

  async update(username: string, updateUserData: UpdateUserDto) {
    let userData = await this.userRepository.findOneBy({ username });
    if (!userData) {
      const errors = [{ username: 'User not found.' }];
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (isEmpty(updateUserData)) return 'Nothing to update!';

    if (updateUserData?.password) {
      updateUserData.password = await argon2.hash(updateUserData.password);
    }

    const updatedUserData = { ...userData, ...updateUserData };

    return await this.userRepository.update(
      updatedUserData.id,
      updatedUserData,
    );
  }

  async delete(email: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ email });
  }

  public generateJWT(user: UserDbData) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        exp: exp.getTime() / 1000,
      },
      process.env.JWT_SECRET,
    );
  }
}
