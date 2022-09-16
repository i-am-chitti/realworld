import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
