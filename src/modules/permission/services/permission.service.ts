import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/Permission.entity';
import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { UpdatePermissionDto } from '../dtos/update-permission.dto';
import { Role } from 'src/modules/role/entities/Role.entity';
import { RolesService } from 'src/modules/role/services/role.service';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @Inject(forwardRef(() => RolesService))
    private readonly roleService: RolesService
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = new Permission();

    // check name unique
    const nameExist = await this.permissionRepository.findOneBy({name : createPermissionDto.name})
    if(nameExist){
      throw new BadRequestException('name permission da ton tai') 
    }

    // gán createPermissionDto vào cho permission
    Object.assign(permission, createPermissionDto)

    // set quyền cho role
    if(createPermissionDto.roles){
      const roles: Role[] = [];
      for (let roleId of createPermissionDto.roles) {
        roles.push(await this.roleService.getById(roleId))
      }
      permission.roles=roles
    }

    return this.permissionRepository.save(permission);
  }

  async getAll(): Promise<Permission[]> {
    return this.permissionRepository.find({
      relations: {
          roles: true,
      },
    });
  }

  async getById(id:number):Promise<Permission> {
    const permission = await this.permissionRepository.findOneBy({ id });
    
    if (!permission) {
      throw new BadRequestException('permisson không tồn tại');
    }

    return this.permissionRepository.findOne({
      relations: {
          roles: true,
      },
      where: { id: id }
    });
  }

  async update(id:number,updatepermissionDto : UpdatePermissionDto):Promise<Permission>{
    //  check permission exits
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission) {
      throw new BadRequestException('permisson không tồn tại');
    }
    // check update name
    if(updatepermissionDto.name){
      const nameExist = await this.permissionRepository.findOneBy({ name: permission.name });
      if (nameExist && nameExist.id !== id) {
        throw new BadRequestException('Tên permission đã tồn tại');
      }
    }
    Object.assign(permission, updatepermissionDto);

    // tạo mảng đối tượng role cho permission 
    if (updatepermissionDto.roles) {
      const roles: Role[] = [];
      for (let roleId of updatepermissionDto.roles) {
        roles.push(await this.roleService.getById(roleId));
      }
      permission.roles = roles;
    }

    return await this.permissionRepository.save(permission)
  }
  async delete(id:number):Promise<number> {
    const permission =  await this.permissionRepository.findOneBy({id:id});
    await this.permissionRepository.remove(permission);
    return 1;
  }

}