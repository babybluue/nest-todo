import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<any> {
    const user = await this.userService.findOneByUsername(signInDto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const { password, ...userWithoutPassword } = user;
    const isPasswordValid = await bcrypt.compare(signInDto.password, password);
    if (isPasswordValid) {
      return {
        access_token: this.jwtService.sign(userWithoutPassword),
      };
    }
    throw new UnauthorizedException('Invalid username or password');
  }
}
