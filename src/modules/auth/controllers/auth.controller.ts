import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { User } from 'src/modules/user/entities/User.entity';
import { LoginDto } from '../dtos/login.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { logger } from 'src/logs/LoggerFactory';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signUp')
  signUp(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.signUp(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  async signIn(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    return this.authService.signIn(loginDto, response);
  }

  @HttpCode(HttpStatus.OK)
  @Get('renew-token')
  async renewToken(@Req() request: any): Promise<any> {
    logger.error('test log looi', 'authController');
    return this.authService.refreshToken(request);
  }

  @HttpCode(HttpStatus.OK)
  @Get('logOut')
  async logOut(
    @Req() request: any,
    @Res({ passthrough: true }) response: any,
  ): Promise<any> {
    return this.authService.logOut(request, response);
  }
}
