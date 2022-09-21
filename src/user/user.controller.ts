import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpException, Param, Patch, Post, Put, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	async findMe() {
		return "Here I am";
	}

	@Get('all')
	async findAll() {
		return this.userService.findAll();
	}

	@Patch(':username')
	async update(@Param('username') username: string, @Body() updateUserData: UpdateUserDto) {
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
		const _user = await this.userService.findOne(loginData);
		const errors = [{ user: "Not Found" }];
		if(!_user) {
			throw new HttpException({message: "User not exists.", errors}, 401);
		}
		const token = this.userService.generateJWT(_user);
		const user = {..._user, token};
		delete user.password;
		return user;
	}
}
