import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/Role.entity';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { PermissionsService } from 'src/modules/permission/services/permission.service';
import { Permission } from 'src/modules/permission/entities/Permission.entity';


@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @Inject(forwardRef(() => PermissionsService))
    private readonly permissionsService: PermissionsService,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = new Role();
    const nameExist = await this.roleRepository.findOneBy({
      name: createRoleDto.name,
    });
    if (nameExist) {
      throw new BadRequestException('name role da ton tai');
    }
    // role.name= createRoleDto.name;
    Object.assign(role, createRoleDto);
    if (createRoleDto.permissions) {
      const permissions: Permission[] = [];
      for (let permissionId of createRoleDto.permissions) {
        permissions.push(await this.permissionsService.getById(permissionId));
      }
      role.permissions = permissions;
    }

    return await this.roleRepository.save(role);
  }

  async getAll(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: {
        permissions: true,
      },
    });
  }

  async getRoles(roles: number[]): Promise<Role[]> {
    return await this.roleRepository
      .createQueryBuilder('role')
      .where('role.id in (:...roles) ', { roles: roles })
      .getMany();
  }

  async getById(id: number): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id });

    if (!role) {
      throw new BadRequestException('Role không tồn tại');
    }

    return this.roleRepository.findOne({
      relations: {
        permissions: true,
      },
      where: { id: id },
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    // check role tồn tại
    const role = await this.roleRepository.findOneBy({ id });

    if (!role) {
      throw new BadRequestException('Role không tồn tại');
    }

    // name unique
    if (updateRoleDto.name) {
      const nameExist = await this.roleRepository.findOneBy({
        name: updateRoleDto.name,
      });
      if (nameExist && nameExist.id !== id) {
        throw new BadRequestException('Tên role đã tồn tại');
      }
    }

    // gán updateDto vào role
    Object.assign(role, updateRoleDto);
    if (updateRoleDto.permissions) {
      const permissions: Permission[] = [];
      for (let permissionId of updateRoleDto.permissions) {
        permissions.push(await this.permissionsService.getById(permissionId));
      }
      role.permissions = permissions;
    }

    return await this.roleRepository.save(role);
  }

  async delete(id: number): Promise<number> {
    const user = await this.roleRepository.findOneBy({ id: id });
    await this.roleRepository.remove(user);
    return 1;
  }
}