/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiDoc } from '../decorators/swagger.decorator';
import {
  GetAllUsersResponse,
  UpdaateRoleDto,
  UpdateUserByAdminDto,
  UpdateUserDto,
  UserMessageResponseDto,
  UserResponseDto,
} from './dto';
import { UserService } from './user.service';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email?: string;
    [key: string]: any;
  };
}

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private userService: UserService) {}

  @ApiDoc({
    summary: 'Get all users',
    description: 'Retrieves all users. Returns total count and user list.',
    response: GetAllUsersResponse,
    status: HttpStatus.OK,
  })
  @UseGuards(AuthGuard)
  @Get()
  async getAllUsers() {
    return this.userService.getAllUser();
  }

  @ApiDoc({
    summary: 'Get user by ID',
    description: 'Retrieves a user by their unique ID.',
    response: UserResponseDto,
    status: HttpStatus.OK,
  })
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @ApiDoc({
    summary: 'Get user by email',
    description: 'Retrieves a user by their email address.',
    response: UserResponseDto,
    status: HttpStatus.OK,
  })
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.getUserByEmail(email);
  }

  @ApiDoc({
    summary: 'Update user',
    description: 'Updates the authenticated user information.',
    response: UserResponseDto,
    status: HttpStatus.OK,
  })
  @Patch(':id')
  async updateUserById(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Request() req: any,
  ) {
    return this.userService.updateUserInformation(id, dto, req.user.id);
  }

  @ApiDoc({
    summary: 'Update user role (Admin)',
    description: "Updates a user's role. Requires Admin/SuperAdmin privileges.",
    response: UserMessageResponseDto,
    status: HttpStatus.OK,
  })
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch('update-user-role/:userId')
  UpdateUserRole(
    @Body()
    dto: UpdaateRoleDto,
    @Request() req: AuthenticatedRequest,
    @Param('userId') userId: string,
  ) {
    return this.userService.UpdateRole(dto, userId);
  }

  @ApiDoc({
    summary: 'Update user (Admin)',
    description:
      'Updates a user including status. Requires Admin/SuperAdmin privileges.',
    response: UserMessageResponseDto,
    status: HttpStatus.OK,
  })
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Patch('update-user/:userId')
  UpdateUser(
    @Body()
    dto: UpdateUserByAdminDto,
    @Request() req: AuthenticatedRequest,
    @Param('userId') userId: string,
  ) {
    return this.userService.UpdateUser(dto, userId);
  }
}
