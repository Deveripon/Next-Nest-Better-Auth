import { Injectable } from '@nestjs/common';
import { Permission, Role } from '@prisma/client';
import { ROLE_PERMISSIONS } from 'config/roles.config';
import { PrismaService } from 'src/prisma/prisma.service';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Assigns a role to a user.
   * @param userId - The ID of the user to assign the role to
   * @param role - The role to assign to the user
   * @param assignedBy - The ID of the user who is assigning the role (optional)
   * @returns An object containing the updated user with the role, the permissions for the role, and a success message
   * @throws NotFoundException - If the user does not exist
   * @throws BadRequestException - If the role assignment fails
   */
  async assignRoleToUser(userId: string, role: Role, assignedBy?: string) {
    // First check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          role,
          roleAssignedAt: new Date(),
          roleAssignedBy: assignedBy,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          roleAssignedAt: true,
          roleAssignedBy: true,
        },
      });

      return {
        message: 'Role assigned successfully',
        data: {
          ...updatedUser,
          permissions: ROLE_PERMISSIONS[role] || [],
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to assign role to user');
    }
  }

  /**
   * Finds a user by their ID and returns their role and permissions.
   * @param userId The ID of the user to find
   * @returns The user object with their role, role assigned at date, role assigned by, and permissions; otherwise throws a NotFoundException
   */
  async getUserWithRoleAndPermissions(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        roleAssignedAt: true,
        roleAssignedBy: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get permissions for the user's role
    const permissions = ROLE_PERMISSIONS[user.role] || [];

    return {
      ...user,
      permissions,
    };
  }

  /**
   * Retrieves a list of users with their roles and permissions.
   * @param page The page number to retrieve (1-indexed)
   * @param limit The number of users to retrieve per page
   * @param roleFilter Optional filter to retrieve users with a specific role
   * @returns An object containing the list of users with their roles, permissions, and pagination metadata
   */
  async getAllUsersWithRoles(
    page: number = 1,
    limit: number = 10,
    roleFilter?: Role,
  ) {
    const skip = (page - 1) * limit;
    const where = roleFilter ? { role: roleFilter } : {};

    try {
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          skip,
          take: limit,
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            status: true,
            createdAt: true,
            roleAssignedAt: true,
            roleAssignedBy: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.user.count({ where }),
      ]);

      // Add permissions to each user based on their role
      const usersWithPermissions = users.map((user) => ({
        ...user,
        permissions: ROLE_PERMISSIONS[user.role] || [],
      }));

      return {
        data: usersWithPermissions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch users');
    }
  }

  /**
   * Validates if a user has a specific permission.
   * @param userId - The ID of the user to validate.
   * @param permission - The permission to check for the user.
   * @returns An object containing the user's role, permissions, and a flag indicating if the user has the specified permission.
   */

  async validateUserPermission(userId: string, permission: Permission) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return { hasPermission: false, reason: 'User not found' };
    }

    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    const hasPermission = userPermissions.includes(permission);

    return {
      hasPermission,
      role: user.role,
      permissions: userPermissions,
    };
  }

  // Get available roles with their permissions
  getAvailableRolesWithPermissions() {
    return {
      data: ROLE_PERMISSIONS,
    };
  }

  // Get all available permissions
  getAvailablePermissions() {
    const permissions = Object.values(Permission);
    return { data: permissions };
  }

  /**
   * Search users by role or permission.
   * @param role - The role to filter users by, if provided.
   * @param permission - The permission to filter users by, if provided.
   * @param page - The page number to retrieve (1-indexed), defaults to 1.
   * @param limit - The number of users to retrieve per page, defaults to 10.
   * @returns An object containing the list of users matching the search criteria, pagination metadata, and the search criteria used.
   */
  async searchUsersByRoleOrPermission(
    role?: Role,
    permission?: Permission,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (role) {
      where.role = role;
    } else if (permission) {
      // Find roles that have this permission
      const rolesWithPermission = Object.entries(ROLE_PERMISSIONS)
        .filter(([_, permissions]) => permissions.includes(permission))
        .map(([role, _]) => role as Role);

      where.role = { in: rolesWithPermission };
    }

    try {
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          skip,
          take: limit,
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        }),
        this.prisma.user.count({ where }),
      ]);

      // Add permissions to each user
      const usersWithPermissions = users.map((user) => ({
        ...user,
        permissions: ROLE_PERMISSIONS[user.role] || [],
      }));

      return {
        data: usersWithPermissions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        searchCriteria: { role, permission },
      };
    } catch (error) {
      throw new BadRequestException('Failed to search users');
    }
  }

  /**
   * Assigns a role to multiple users at once.
   * @param userIds - IDs of the users to assign the role to
   * @param role - The role to assign to the users
   * @param assignedBy - The ID of the user who is assigning the role
   * @returns An object containing the number of users the role was assigned to, the role, and the permissions for the role.
   * @throws NotFoundException - If any of the users do not exist
   * @throws BadRequestException - If the role assignment fails
   */
  async bulkAssignRole(userIds: string[], role: Role, assignedBy: string) {
    // First, verify all users exist
    const existingUsers = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });

    const existingUserIds = existingUsers.map((user) => user.id);
    const nonExistentUserIds = userIds.filter(
      (id) => !existingUserIds.includes(id),
    );

    if (nonExistentUserIds.length > 0) {
      throw new NotFoundException(
        `Users not found: ${nonExistentUserIds.join(', ')}`,
      );
    }

    try {
      const result = await this.prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: {
          role,
          roleAssignedAt: new Date(),
          roleAssignedBy: assignedBy,
        },
      });

      return {
        message: `Role assigned to ${result.count} users successfully`,
        assignedCount: result.count,
        role,
        permissions: ROLE_PERMISSIONS[role] || [],
      };
    } catch (error) {
      throw new BadRequestException('Failed to bulk assign roles');
    }
  }

  /**
   * Finds the role history of a user.
   * @param userId - ID of the user whose role history to find
   * @returns An object containing the user's current role, permissions, the date the role was assigned, the user ID of the person who assigned the role, and the date the user was created; otherwise throws NotFoundException
   */
  async getUserRoleHistory(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        roleAssignedAt: true,
        roleAssignedBy: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return {
      currentRole: user.role,
      permissions: ROLE_PERMISSIONS[user.role] || [],
      roleAssignedAt: user.roleAssignedAt,
      roleAssignedBy: user.roleAssignedBy,
      userCreatedAt: user.createdAt,
    };
  }
}
