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
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'đăng kí thành công' })
  @ApiResponse({ status: 400, description: 'đăng kí thất bại' })
  @Post('signUp')
  signUp(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.signUp(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  @ApiResponse({ status: 200, description: 'login thành công' })
  @ApiResponse({ status: 400, description: 'login thất bại' })
  async signIn(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    return this.authService.signIn(loginDto, response);
  }

  @HttpCode(HttpStatus.OK)
  @Get('renew-token')
  @ApiResponse({ status: 200, description: 'refesh token thành công' })
  @ApiResponse({ status: 403, description: 'token không hợp lệ' })
  async renewToken(@Req() request: any): Promise<any> {
    return this.authService.refreshToken(request);
  }
}
