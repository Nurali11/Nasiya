import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const RolesD = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
