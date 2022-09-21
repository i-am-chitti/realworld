import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpException, Param, Patch, Post, Put, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.decorator';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Get('me')
	async findMe(@User('id') userId: number) {
		return this.userService.findById(userId);
	}

	@Get('all')
	async findAll() {
		return this.userService.findAll();
	}

	@Patch('me')
	async updateMyself(@User('username') username: string, @Body() updateUserData: UpdateUserDto) {
		return this.userService.update(username, updateUserData);
	}

	@Post('register')
	async create(@Body() userData: RegisterUserDto) {
		return this.userService.create(userData);
	}

	@Delete(':email')
	async delete(@Param() params: DeleteUserDto) {
		return this.userService.delete(params.email);
	}

	@Post('login')
	async login(@Body() loginData: LoginUserDto) {
		return this.userService.loginUser(loginData);
	}
}
