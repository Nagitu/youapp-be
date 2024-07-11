import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from'bcrypt'
import {LoginDto} from './dto/login.dto'
import {RegisterDto} from './dto/register.dto'

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(LoginDto: LoginDto): Promise<{ access_token: string }> {
    const { username, password } = LoginDto;
    const user = await this.usersService.findOne(username);
    console.log(user);
    console.log(password);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong Password, please input right password');
    }

    const payload = { id: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { username, email, password } = registerDto;

    // Check if the user already exists
    const existingUser = await this.usersService.findOne(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersService.create({
      username,
      email,
      password: hashedPassword,
    });

    return { message: 'User successfully registered' };
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

}
