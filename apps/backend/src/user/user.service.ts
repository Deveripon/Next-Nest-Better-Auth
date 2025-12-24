import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';

import { UpdaateRoleDto, UpdateUserByAdminDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieve all users from the database.
   * @returns An object containing the total number of users and an array of user objects.
   * @throws {Error} If there is an error while retrieving users.
   */
  async getAllUser() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!users || users.length === 0) {
        throw new NotFoundException('No users found');
      }
      return {
        totalUsers: users?.length,
        users,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user to retrieve
   * @returns A user object with their preferences, trip reviews, bookings, payments, and created trips. If the user is not found, a NotFoundException is thrown.
   * @throws {NotFoundException} If the user is not found.
   */
  async getUserById(id: string) {
    try {
      // find user with preferences
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      // if user not found throw exeption
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
        ...user,
        password: 'Password Is Encripted',
      };
    } catch (error) {
      console.log(`error on fetching user`, error);
      throw error;
    }
  }

  /**
   * Retrieves a user by their email address.
   * @param email - The email address of the user to retrieve
   * @returns A user object with their preferences, trip reviews, bookings, payments, and created trips. If the user is not found, a NotFoundException is thrown.
   * @throws {NotFoundException} If the user is not found.
   */
  async getUserByEmail(email: string) {
    try {
      // find user with preferences
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      // if user not found throw exeption
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      console.log(`error on fetching user`, error);
      throw error;
    }
  }

  /**
   * Update user information.
   * @param id - The ID of the user to update
   * @param dto - The user information to update
   * @returns The updated user object with their preferences, trip reviews, bookings, payments, and created trips. If the user is not found, a NotFoundException is thrown.
   * @throws {NotFoundException} If the user is not found.
   */

  async updateUserInformation(id: string, dto: UpdateUserDto, userId: string) {
    try {
      // find user with preferences
      const user = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          ...dto,
        },
      });
      console.log(user);
      // check if user is the same as the one logged in
      if (user.id !== userId) {
        throw new ForbiddenException('Access Denied');
      }

      // if user not found throw exeption
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      console.log(`error on fetching user`, error);
      throw error;
    }
  }

  async UpdateRole(dto: UpdaateRoleDto, userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found for update');
      }
      /*       if (reqUserId !== user?.createdById) {
        throw new ForbiddenException('You are not allowed to update this user');
      } */

      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role: dto.role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        message: 'User Role Updated Successfully',
        user: updatedUser,
      };
    } catch (error) {
      this.logger.error(`Failed to update user role: ${error.message}`);
      throw error;
    }
  }

  async UpdateUser(dto: UpdateUserByAdminDto, userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found for update');
      }
      /*       if (reqUserId !== user?.createdById) {
        throw new ForbiddenException('You are not allowed to update this user');
      } */

      if (dto.password?.trim()) {
        dto.password = await bcrypt.hash(dto.password, 10);
      }
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        message: 'User Updated Successfully',
        user: updatedUser,
      };
    } catch (error) {
      this.logger.error(`Failed to update user: ${error.message}`);
      throw error;
    }
  }
}
