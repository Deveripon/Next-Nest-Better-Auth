/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Permission, Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import {
  AssignRoleDto,
  AssignRoleResponseDto,
  AvailablePermissionsResponseDto,
  BulkAssignRoleDto,
  BulkAssignRoleResponseDto,
  GetAllUsersResponseDto,
  GetUsersQueryDto,
  RolePermissionsResponseDto,
  SearchUsersDto,
  SearchUsersResponseDto,
  UserRoleHistoryResponseDto,
  UserWithRoleAndPermissionsResponseDto,
  ValidatePermissionResponseDto,
} from 'src/roles/dto/role-management.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiDoc } from 'src/decorators/swagger.decorator';
import { RolesService } from 'src/roles/roles.service';

@ApiTags('Admin')
@Controller({
  path: 'admin',
  version: '1',
})
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class AdminUsersController {
  constructor(private roleService: RolesService) {}

  @ApiDoc({
    summary: 'Get all users with roles',
    description: 'Retrieves all users with their roles and permissions (paginated).',
    response: GetAllUsersResponseDto,
    status: HttpStatus.OK,
  })
  @Get('users')
  async getAllUsersWithRoles(@Query() query: GetUsersQueryDto) {
    return this.roleService.getAllUsersWithRoles(
      query.page || 1,
      query.limit || 10,
      query.role,
    );
  }

  @ApiDoc({
    summary: 'Get user role',
    description: 'Retrieves a user with their role and permissions.',
    response: UserWithRoleAndPermissionsResponseDto,
    status: HttpStatus.OK,
  })
  @Get(':userId/role')
  async getUserRole(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.roleService.getUserWithRoleAndPermissions(userId);
  }

  @ApiDoc({
    summary: 'Assign role',
    description: 'Assigns a role to a user.',
    response: AssignRoleResponseDto, // Actually service likely returns UserWithRoleAndPermissionsResponseDto or similar, but let's assume one
    status: HttpStatus.OK,
  })
  @Post(':userId/role')
  @HttpCode(HttpStatus.OK)
  async assignRole(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() assignRoleDto: AssignRoleDto,
    @Request() req,
  ) {
    return this.roleService.assignRoleToUser(
      userId,
      assignRoleDto.role,
      req.user.id,
    );
  }

  @ApiDoc({
    summary: 'Validate permission',
    description: 'Checks if a user has a specific permission.',
    response: ValidatePermissionResponseDto,
    status: HttpStatus.OK,
  })
  @Get(':userId/validate-permission/:permission')
  async validateUserPermission(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('permission') permission: Permission,
  ) {
    return this.roleService.validateUserPermission(userId, permission);
  }

  @ApiDoc({
    summary: 'Get available roles',
    description: 'Retrieves all available roles with their permissions.',
    response: RolePermissionsResponseDto,
    status: HttpStatus.OK,
  })
  @Get('roles/available')
  getAvailableRoles() {
    return this.roleService.getAvailableRolesWithPermissions();
  }

  @ApiDoc({
    summary: 'Get available permissions',
    description: 'Retrieves a list of all available permissions.',
    response: AvailablePermissionsResponseDto,
    status: HttpStatus.OK,
  })
  @Get('permissions/available')
  getAvailablePermissions() {
    return this.roleService.getAvailablePermissions();
  }

  @ApiDoc({
    summary: 'Search users',
    description: 'Search users by role or permission.',
    response: SearchUsersResponseDto,
    status: HttpStatus.OK,
  })
  @Get('search')
  async searchUsersByRoleOrPermission(@Query() searchDto: SearchUsersDto) {
    return this.roleService.searchUsersByRoleOrPermission(
      searchDto.role,
      searchDto.permission,
      searchDto.page || 1,
      searchDto.limit || 10,
    );
  }

  @ApiDoc({
    summary: 'Bulk assign roles',
    description: 'Assigns a role to multiple users.',
    response: BulkAssignRoleResponseDto,
    status: HttpStatus.OK,
  })
  @Post('bulk/assign-role')
  @HttpCode(HttpStatus.OK)
  async bulkAssignRole(
    @Body() bulkAssignDto: BulkAssignRoleDto,
    @Request() req,
  ) {
    return this.roleService.bulkAssignRole(
      bulkAssignDto.userIds,
      bulkAssignDto.role,
      req.user.id,
    );
  }

  @ApiDoc({
    summary: 'Get user role history',
    description: 'Retrieves the history of role assignments for a user.',
    response: UserRoleHistoryResponseDto,
    isArray: true,
    status: HttpStatus.OK,
  })
  @Get(':userId/role/history')
  async getUserRoleHistory(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.roleService.getUserRoleHistory(userId);
  }
}
