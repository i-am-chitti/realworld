import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/user/user.decorator';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfiles() {
	return await this.profileService.findAll();
  }

  @Get(':username')
  async getProfile(@User('id') userId: number, @Param('username') username: string) {
    return await this.profileService.findProfile(userId, username);
  }

  @Post(':username/follow')
  async follow(@User('email') email: string, @Param('username') username: string) {
    return await this.profileService.follow(email, username);
  }

  @Delete(':username/follow')
  async unFollow(@User('id') userId: number,  @Param('username') username: string) {
    return await this.profileService.unFollow(userId, username);
  }
}
