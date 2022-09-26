import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { FollowsEntity } from './follows.entity';
import { ProfileData } from './profile.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity)
    private readonly followsRepository: Repository<FollowsEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findProfile(id: number, followingUsername: string) {
    const _profile = await this.userRepository.findOneBy({
      username: followingUsername,
    });

    if (!_profile) return;
    let profile: ProfileData = { ..._profile };

    const follows = await this.followsRepository.findOneBy({
      followerId: id,
      followingId: _profile.id,
    });

    if (id) {
      profile.following = !!follows;
    }

    return { profile };
  }

  async follow(followerEmail: string, username: string) {
    if (!followerEmail || !username) {
      throw new HttpException(
        'Follower email and username not provided.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const followingUser = await this.userRepository.findOneBy({ username });

    if (!followingUser) {
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
    }

    const followerUser = await this.userRepository.findOneBy({
      email: followerEmail,
    });

    if (!followerUser) {
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
    }

    if (followingUser.email === followerEmail) {
      throw new HttpException(
        'FollowerEmail and FollowingId cannot be equal.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const _follows = await this.followsRepository.findOneBy({
      followerId: followerUser.id,
      followingId: followingUser.id,
    });

    if (!_follows) {
      const follows = this.followsRepository.create({
        followerId: followerUser.id,
        followingId: followingUser.id,
      });
      await this.followsRepository.save(follows);
    }

    let profile: ProfileData = {
      ...followingUser,
      following: true,
    };

    return { profile };
  }

  async unFollow(followerId: number, username: string) {
    if (!followerId || !username) {
      throw new HttpException(
        'FollowerId and username not provided.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const followingUser = await this.userRepository.findOneBy({ username });

    if (followingUser.id === followerId) {
      throw new HttpException(
        'FollowerId and FollowingId cannot be equal.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const followingId = followingUser.id;
    await this.followsRepository.delete({ followerId, followingId });

    let profile: ProfileData = {
      ...followingUser,
      following: false,
    };

    return { profile };
  }
}
