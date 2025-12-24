import { Permission, Role } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleDto {
  @ApiProperty({ description: 'Role to assign', enum: Role })
  @IsEnum(Role, {
    message:
      'Role must be one of: SUPER_ADMIN, ADMIN, TOUR_OPERATOR, USER, GUIDE, STAFF',
  })
  role: Role;
}

export class BulkAssignRoleDto {
  @ApiProperty({ description: 'Array of User IDs', type: [String] })
  @IsArray()
  @IsUUID(4, { each: true })
  userIds: string[];

  @ApiProperty({ description: 'Role to assign', enum: Role })
  @IsEnum(Role, {
    message:
      'Role must be one of: SUPER_ADMIN, ADMIN, TOUR_OPERATOR, USER, GUIDE, STAFF',
  })
  role: Role;
}

export class GetUsersQueryDto {
  @ApiProperty({ description: 'Page number', default: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', default: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({ description: 'Filter by Role', enum: Role, required: false })
  @IsOptional()
  @IsEnum(Role, {
    message:
      'Role must be one of: SUPER_ADMIN, ADMIN, TOUR_OPERATOR, USER, GUIDE, STAFF',
  })
  role?: Role;
}

export class SearchUsersDto {
  @ApiProperty({ description: 'Filter by Role', enum: Role, required: false })
  @IsOptional()
  @IsEnum(Role, {
    message:
      'Role must be one of: SUPER_ADMIN, ADMIN, TOUR_OPERATOR, USER, GUIDE, STAFF',
  })
  role?: Role;

  @ApiProperty({ description: 'Filter by Permission', enum: Permission, required: false })
  @IsOptional()
  @IsEnum(Permission, {
    message: 'Permission must be a valid permission value',
  })
  permission?: Permission;

  @ApiProperty({ description: 'Page number', default: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', default: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class ValidatePermissionDto {
  @ApiProperty({ description: 'Permission to validate', enum: Permission })
  @IsEnum(Permission, {
    message: 'Permission must be a valid permission value',
  })
  permission: Permission;
}

// Response DTOs for better type safety and documentation
export class UserRoleResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: string;
  @ApiProperty({ description: 'User Email' })
  email: string;
  @ApiProperty({ description: 'User Name' })
  name: string;
  @ApiProperty({ description: 'Assigned Role', enum: Role })
  role: Role;
  @ApiProperty({ description: 'Date when role was assigned' })
  roleAssignedAt: Date;
  @ApiProperty({ description: 'User ID who assigned the role' })
  roleAssignedBy: string;
  @ApiProperty({ description: 'List of permissions for this role', enum: Permission, isArray: true })
  permissions: Permission[];
}

export class UserWithRoleAndPermissionsResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: string;
  @ApiProperty({ description: 'User Email' })
  email: string;
  @ApiProperty({ description: 'User Name' })
  name: string;
  @ApiProperty({ description: 'Assigned Role', enum: Role })
  role: Role;
  @ApiProperty({ description: 'Date when role was assigned' })
  roleAssignedAt: Date;
  @ApiProperty({ description: 'User ID who assigned the role' })
  roleAssignedBy: string;
  @ApiProperty({ description: 'User verification status' })
  isVerified: boolean;
  @ApiProperty({ description: 'Date when user was created' })
  createdAt: Date;
  @ApiProperty({ description: 'List of permissions for this role', enum: Permission, isArray: true })
  permissions: Permission[];
}

export class PaginationResponseDto {
  @ApiProperty({ description: 'Current page number' })
  page: number;
  @ApiProperty({ description: 'Items per page' })
  limit: number;
  @ApiProperty({ description: 'Total number of items' })
  total: number;
  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}

export class GetAllUsersResponseDto {
  @ApiProperty({ type: [UserWithRoleAndPermissionsResponseDto] })
  data: UserWithRoleAndPermissionsResponseDto[];
  @ApiProperty({ type: PaginationResponseDto })
  pagination: PaginationResponseDto;
}

export class ValidatePermissionResponseDto {
  @ApiProperty({ description: 'Whether the user has the permission' })
  hasPermission: boolean;
  @ApiProperty({ description: 'Assigned Role', enum: Role })
  role: Role;
  @ApiProperty({ description: 'List of permissions', enum: Permission, isArray: true })
  permissions: Permission[];
  @ApiProperty({ description: 'Reason for denial if applicable', required: false })
  reason?: string;
}

export class RolePermissionsResponseDto {
  @ApiProperty({ description: 'Map of Roles to Permissions' })
  data: Record<Role, Permission[]>;
}

export class AvailablePermissionsResponseDto {
  @ApiProperty({ description: 'List of all available permissions', enum: Permission, isArray: true })
  data: Permission[];
}

export class SearchUsersResponseDto {
  @ApiProperty({ type: [UserWithRoleAndPermissionsResponseDto] })
  data: UserWithRoleAndPermissionsResponseDto[];
  @ApiProperty({ type: PaginationResponseDto })
  pagination: PaginationResponseDto;
  @ApiProperty({ description: 'Search criteria applied' })
  searchCriteria: {
    role?: Role;
    permission?: Permission;
  };
}

export class BulkAssignRoleResponseDto {
  @ApiProperty({ description: 'Success message' })
  message: string;
  @ApiProperty({ description: 'Number of users assigned' })
  assignedCount: number;
  @ApiProperty({ description: 'Assigned Role', enum: Role })
  role: Role;
  @ApiProperty({ description: 'Permissions granted', enum: Permission, isArray: true })
  permissions: Permission[];
}

export class UserRoleHistoryResponseDto {
  @ApiProperty({ description: 'Current Role', enum: Role })
  currentRole: Role;
  @ApiProperty({ description: 'Current Permissions', enum: Permission, isArray: true })
  permissions: Permission[];
  @ApiProperty({ description: 'Role assignment date' })
  roleAssignedAt: Date;
  @ApiProperty({ description: 'User ID who assigned' })
  roleAssignedBy: string;
  @ApiProperty({ description: 'User creation date' })
  userCreatedAt: Date;
}

export class AssignRoleResponseDto {
  @ApiProperty({ description: 'Success message' })
  message: string;
  @ApiProperty({ type: UserRoleResponseDto })
  data: UserRoleResponseDto;
}
