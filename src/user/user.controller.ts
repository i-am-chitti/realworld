import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Post, Put, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	async findMe() {
		return "Here I am";
	}

	@Put()
	async update() {
		return "User will be updated";
	}

	@UsePipes(new ValidationPipe())
	@Post('register')
	async create(@Body() userData: RegisterUserDto) {
		return this.userService.create(userData);
	}

	@Delete(':username')
	async delete() {
		return "User will be deleted";
	}

	@Post('login')
	async login() {
		return "User will be logged in";
	}
}
