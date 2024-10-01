import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from '../role/services/role.service';
import { Role } from '../role/role.enum';
import { UsersService } from '../user/services/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private roleService: RolesService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    return this.includeRoles(roles, userId);
  }
  private async includeRoles(roles: any[], userId: number): Promise<boolean> {
    const user = await this.usersService.getById(userId);
    const role = await this.roleService.getById(user.roleId);
    return roles.includes(role.name);
  }
}
