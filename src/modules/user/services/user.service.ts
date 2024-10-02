import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { User } from '../entities/User.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { RolesService } from 'src/modules/role/services/role.service';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RolesService,
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
      throw new BadRequestException('user không tồn tại');
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

  //  update pass chưa mã hóa
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getById(id);
    if (updateUserDto.roleId) {
      const role = await this.roleService.getById(updateUserDto.roleId);
      if (!role) {
        throw new BadRequestException('role chua ton tai');
      }
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
}