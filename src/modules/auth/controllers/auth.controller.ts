import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { User } from 'src/modules/user/entities/User.entity';
import { LoginDto } from '../dtos/login.dto';
import { Response } from 'express';
import { Auth } from '../auth.decorator';
import { Role } from 'src/modules/role/role.enum';

@Controller('auth')
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
  @Auth([Role.Admin], { isPublic: true })
  async renewToken(@Req() request: any): Promise<any> {
    return this.authService.refreshToken(request);
  }
}
