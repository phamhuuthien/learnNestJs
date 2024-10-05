import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/user/entities/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesService } from 'src/modules/role/services/role.service';
import { Response, Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
    private jwtService: JwtService,
  ) {}

  async signUp(registerDto: RegisterDto): Promise<User> {
    // check roleId có tồn tại không
    if (registerDto.roleId) {
      await this.rolesService.getById(registerDto.roleId);
    }
    // check email có tồn tại không
    if (registerDto.email) {
      const emailExist = await this.userRepository.findOneBy({
        email: registerDto.email,
      });
      if (emailExist) {
        throw new ConflictException('email da ton tai');
      }
    }
    const hashPassword = await this.hashPassword(registerDto.password);
    return this.userRepository.save({ ...registerDto, password: hashPassword });
  }

  async signIn(loginDto: any, response: Response): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    // check email exist
    if (!user) {
      throw new BadRequestException('user không tồn tại');
    }
    //  check password
    const checkPassword = bcrypt.compareSync(loginDto.password, user.password);
    if (!checkPassword) {
      throw new UnauthorizedException('password không chính xác');
    }

    let accessToken: string;
    let refreshToken: string;

    refreshToken = await this.generateRefreshToken({
      email: user.email,
    });
    accessToken = await this.generateAccessToken({
      id: user.id,
      email: user.email,
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });
    return { accessToken };
  }

  async refreshToken(request: Request): Promise<any> {
    try {
      const refreshToken = request.cookies?.refreshToken || '';
      try {
        await this.jwtService.verifyAsync(refreshToken, {
          secret: process.env.JWT_SECRET_REFRESHTOKEN,
        });
      } catch (error) {
        throw new UnauthorizedException('Xác thực thất bại');
      }
      const decode = this.jwtService.decode(refreshToken);
      const user = await this.userRepository.findOne({
        where: { email: decode.email },
      });
      if (!user) throw new UnauthorizedException('Xác thực thất bại');
      return this.generateAccessToken({ id: user.id, email: user.email });
    } catch (error) {
      throw new UnauthorizedException('token không hợp lệ');
    }
  }

  async logOut(request: Request, response: Response) {
    const refreshToken = request.cookies?.refreshToken;
    if (!refreshToken) {
      throw new ConflictException('token không hợp lệ');
    }
    response.clearCookie('refreshToken');
    return { mesage: ' logout successfully' };
  }

  private async hashPassword(password: string) {
    const saltOrRounds = +process.env.SALT;
    const salt = await bcrypt.genSalt(saltOrRounds);
    return await bcrypt.hash(password, salt);
  }

  private async generateRefreshToken(payload: {
    email: string;
  }): Promise<string> {
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_REFRESHTOKEN,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });
    return refreshToken;
  }

  private async generateAccessToken(payload: {
    id: number;
    email: string;
  }): Promise<string> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_ACCESSTOKEN,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });
    return accessToken;
  }
}
