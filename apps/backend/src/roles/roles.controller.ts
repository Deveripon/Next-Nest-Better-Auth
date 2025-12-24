import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDoc } from '../decorators/swagger.decorator';
import { RolePermissionsResponseDto } from './dto/role-management.dto';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller({
  path: 'roles',
  version: '1',
})
/* @UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN) */
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiDoc({
    summary: 'Get all roles and permissions',
    description: 'Retrieves all available roles along with their permissions.',
    response: RolePermissionsResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  getAllRolePermission() {
    return this.roleService.getAvailableRolesWithPermissions();
  }
}
