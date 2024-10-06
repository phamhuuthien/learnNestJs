import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Not, Repository } from 'typeorm';
import { User } from '../entities/User.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { RolesService } from 'src/modules/role/services/role.service';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import * as bcrypt from 'bcrypt';
import { PaginationInterface } from '../interfaces/pagination.interface';
import { fillterUserDto } from '../dtos/fillter-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ForgotPassword } from '../dtos/forgot-password.dto';
import { JwtService } from '@nestjs/jwt';
import { ResetPassword } from '../dtos/reset-password.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RolesService,
    private readonly mailService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    if (createUserDto.roleId) {
      const role = await this.roleService.getById(createUserDto.roleId);
      user.role = role;
    }
    if (createUserDto.email) {
      const checkUser = await this.emailExist(createUserDto.email);
      if (checkUser) {
        throw new BadRequestException('email da ton tai');
      }
    }
    createUserDto.password = await this.hashPassword(createUserDto.password);
    Object.assign(user, createUserDto);
    return this.userRepository.save(user);
  }

  // async getAll(): Promise<User[]> {
  //   return this.userRepository.find(
  //     {
  //       select: ['id', 'email'],
  //       relations: [],
  //     }
  //   );
  // }

  async forgotPassword(forgotPassword: ForgotPassword) {
    const { email } = forgotPassword;
    const checkEmail = await this.emailExist(email);
    if (!checkEmail) {
      throw new ConflictException('xác thực email thất bại');
    }
    const token = await this.generateToken({ email });
    const message = `Forgot your password? If you didn't forget your password, please click <a href=http://localhost:3000/v1/users/reset-password/${token} >click here</a>`;

    const sendMail = await this.mailService.sendMail({
      from: 'phamhuuthien<phamhuuthienTest2608@gmail.com>',
      // thay đổi với email người dùng nhập. Nhưng đây là test nên để email mình
      to: 'phamhuuthien2608@gmail.com',
      subject: `forgot password`,
      text: message,
    });

    return { message: 'check email' };
  }

  async resetPassword(token: string, resetPassword: ResetPassword) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_TOKEN_SEND_MAIL,
      });
      console.log(payload.exp - new Date().getMilliseconds());

      const checkEmail = await this.emailExist(payload.email);
      if (!checkEmail) {
        throw new ConflictException('xác thực token thật bại ');
      }
      const newPassword = await this.hashPassword(resetPassword.password);
      await this.userRepository.update(
        { email: payload.email },
        { password: newPassword },
      );
      return { message: 'login với password mới' };
    } catch (error) {
      throw new UnauthorizedException('xác thực token thật bại');
    }
  }
  async updateAvatar(id: number, fileName: string) {
    return await this.userRepository.update({ id: id }, { avatar: fileName });
  }

  async getAllUser(query: fillterUserDto) {
    const pageSize = Number(query.pageSize) || Number(process.env.PAGE_SIZE);
    const page = Number(query.page) || 1;

    const skip = (page - 1) * pageSize;
    const search = query.search || '';

    const queybuilder = this.userRepository.createQueryBuilder('user');
    const [data, total] = await queybuilder
      .skip(skip)
      .take(pageSize)
      .where(
        'user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search',
        { search: `%${search}%` },
      )
      .select(['user.id', 'user.firstName', 'user.lastName', 'user.email'])
      .getManyAndCount();

    // const [data, total] = await this.userRepository.findAndCount({
    //   where: [
    //     { firstName: Like('%' + search + '%') },
    //     { lastName: Like('%' + search + '%') },
    //     { email: Like('%' + search + '%') },
    //   ],
    //   // order: { created_at: "DESC" },
    //   take: pageSize,
    //   skip: skip,
    //   select: ['id', 'firstName', 'lastName', 'email'],
    // });
    return {
      data,
      total,
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async getAll(): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .getMany();
  }

  async getPaginate(query: PaginateQuery) {
    return paginate(query, this.userRepository, {
      relations: ['role'],
      sortableColumns: ['id', 'email', 'role.name'],
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['email'],
    });
  }

  // async getById(id:number):Promise<User> {
  //   return this.userRepository.findOneBy({id:id});
  // }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) {
      throw new ConflictException('user không tồn tại');
    }
    return user;
  }

  async emailExist(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({
      email: email,
    });
    if (!user) {
      return false;
    }
    return true;
  }

  async getUserWithRoleId(id: number): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.role = :id', { id })
      .getOne();
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getById(id);
    if (updateUserDto.roleId) {
      const role = await this.roleService.getById(updateUserDto.roleId);
      user.role = role;
    }

    if (updateUserDto.email) {
      const checkUser = await this.emailExist(updateUserDto.email);
      if (checkUser) {
        throw new BadRequestException('email da ton tai');
      }
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }
  async delete(id: number): Promise<number> {
    const user = await this.getById(id);
    await this.userRepository.remove(user);
    await this.userRepository.delete(user);
    return 1;
  }

  async getAllDeletedUser(): Promise<User[]> {
    return this.userRepository.find({
      withDeleted: true,
      where: { delete_at: Not(IsNull()) },
    });
  }

  async softDeleteUser(id: number): Promise<string> {
    await this.userRepository.softDelete(id);
    return 'success soft delete';
  }

  async restoreUser(id: number): Promise<string> {
    await this.userRepository.restore(id);
    return 'restore success';
  }

  private async hashPassword(password: string) {
    const saltOrRounds = +process.env.SALT;
    const salt = await bcrypt.genSalt(saltOrRounds);
    return await bcrypt.hash(password, salt);
  }

  private async generateToken(payload: { email: string }): Promise<string> {
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_TOKEN_SEND_MAIL,
      expiresIn: process.env.SEND_MAIL_EXPIRES_IN,
    });
    return token;
  }
}
