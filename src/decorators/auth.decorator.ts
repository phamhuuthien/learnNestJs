import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '../modules/role/enum/role.enum';
import { AuthGuard } from '../guards/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/role.guard';

export function Auth(
  description: string,
  roles: Role[],
  options?: { isPublic: boolean },
) {
  return applyDecorators(
    SetMetadata('roles', roles),
    SetMetadata('isPublic', options?.isPublic ?? false),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: description }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
