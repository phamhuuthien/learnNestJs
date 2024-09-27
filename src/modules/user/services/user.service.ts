import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { RolesService } from 'src/modules/role/services/role.service';
import { validateHeaderName } from 'http';
import { paginate, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    if(createUserDto.roleId){
      const role = await this.roleService.getById(createUserDto.roleId);
      if(!role){
        throw new BadRequestException('role chua ton tai')
      }
      user.role = role;
    }
    if(createUserDto.email){
      const emailExist = await this.userRepository.findOneBy({email: createUserDto.email})
      if(emailExist) {
        throw new BadRequestException('email da ton tai')
      }
    }
    Object.assign(user,createUserDto) 
    return this.userRepository.save(user);
  }

  async getAll(): Promise<User[]> {
    return this.userRepository.find(
      {
        select: ['id', 'email'], 
        relations: [],
      }
    );
  }

  async getPaginate(query: PaginateQuery){
    return paginate(query,this.userRepository, {
      relations: ['role'],
      sortableColumns: ['id', 'email','role.name'],
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['email'],
    });
  }

  async getById(id:number):Promise<User> {
    return this.userRepository.findOneBy({id:id});
  }

  async update(id:number,updateUserDto : UpdateUserDto):Promise<User>{
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('user không tồn tại');
    }

    if(updateUserDto.roleId){
      const role = await this.roleService.getById(updateUserDto.roleId);
      if(!role){
        throw new BadRequestException('role chua ton tai')
      }
      user.role = role;
    }

    if(updateUserDto.email){
      const emailExist = await this.userRepository.findOneBy({email: updateUserDto.email})
      if(emailExist) {
        throw new BadRequestException('email da ton tai')
      }
    }

    Object.assign(user,updateUserDto)
    return await this.userRepository.save(user)
  }
  async delete(id:number):Promise<number> {
    const user =  await this.userRepository.findOneBy({id:id});
    await this.userRepository.remove(user);
    return 1;
  }

}