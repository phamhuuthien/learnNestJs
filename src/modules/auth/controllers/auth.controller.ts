import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { User } from 'src/modules/user/entities/User.entity';
import { LoginDto } from '../dtos/login.dto';
import { AuthGuard } from '../auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  //   @UseGuards(AuthGuard)
  @Post('signUp')
  signUp(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.signUp(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  async signIn(@Body() loginDto: LoginDto): Promise<any> {
    return this.authService.signIn(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refreshToken')
  async refreshToken(@Body('refreshToken') refreshToken: string): Promise<any> {
    return this.authService.refreshToken(refreshToken);
  }
}
