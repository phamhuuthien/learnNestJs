import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '../role/role.enum';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './role.guard';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function Auth(roles: Role[], options?: { isPublic: boolean }) {
  return applyDecorators(
    SetMetadata('roles', roles),
    SetMetadata('isPublic', options?.isPublic ?? false),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
