/**
 * 1. JwtOrApiKeyGuard
 *    - Use for: Endpoints that need flexible authentication
 *    - Example: Public APIs that can be called by frontend (JWT) or services (API key)
 *
 * 2. AuthGuard('jwt') - Access Token Strategy
 *    - Use for: Standard protected routes
 *    - Example: User profile, protected resources
 *
 * 3. PermissionsGuard
 *    - Use for: Fine-grained access control based on permissions
 *    - Example: Content management, specific actions
 *    - Always use AFTER authentication guard
 *
 * 4. RolesGuard
 *    - Use for: Broad access control based on user roles
 *    - Example: Admin panel, manager dashboard
 *    - Always use AFTER authentication guard
 *
 * 5. RefreshTokenGuard
 *    - Use for: ONLY the token refresh endpoint
 *    - Example: /auth/refresh
 *    - Validates refresh token and allows token renewal
 */

// Just authentication with jwt
/* @UseGuards(AuthGuard('jwt'))

// Authentication with jwt or api key
@UseGuards(JwtOrApiKeyGuard)

    
// Authentication + Role check
@Roles(Role.SUPER_ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)

// Multiple roles (user can have ANY of these roles)
@RequireRoles(Role.ADMIN, Role.MANAGER)

// Authentication + Permission check
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@RequirePermissions(Permission.CREATE_CONTENT)

// Authentication + Role + Permission
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
@Roles(Role.ADMIN)
@RequirePermissions(Permission.MANAGE_SYSTEM)
 */

// ========================================
// COMBINING GUARDS - Common Patterns
// ========================================

/* @Controller('advanced')
export class AdvancedController {
  // Pattern 1: Authentication + Role
  @Get('admin-only')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  adminOnly() {
    // Must be authenticated AND have ADMIN role
    return { message: 'Admin only content' };
  }

  // Pattern 2: Authentication + Permission
  @Post('create-content')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @RequirePermissions(Permission.CREATE_CONTENT)
  createContent() {
    // Must be authenticated AND have CREATE_CONTENT permission
    return { message: 'Content created' };
  }

  // Pattern 3: Authentication + Role + Permission
  @Delete('system/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(Role.SUPER_ADMIN)
  @RequirePermissions(Permission.MANAGE_SYSTEM)
  deleteSystem() {
    // Must be authenticated AND be SUPER_ADMIN AND have MANAGE_SYSTEM permission
    return { message: 'System deleted' };
  }

  // Pattern 4: JWT or API Key + Permission
  @Get('analytics')
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @RequirePermissions(Permission.VIEW_ANALYTICS)
  getAnalytics() {
    // Can authenticate with JWT or API key AND must have VIEW_ANALYTICS permission
    return { message: 'Analytics data' };
  }
} */

// ========================================
// 3. PERMISSIONS GUARD
// ========================================
// Use to check if authenticated user has specific permissions
// Must be used AFTER authentication guard (JWT)

/* 
@Controller('content')
@UseGuards(AuthGuard('jwt'), PermissionsGuard) // First authenticate, then check permissions
export class ContentController {
  // Example 1: Single permission
  @Get()
  @RequirePermissions(Permission.VIEW_CONTENT)
  findAll() {
    // Only users with VIEW_CONTENT permission can access
    return { message: 'All content' };
  }

  // Example 2: Multiple permissions (user must have ALL)
  @Post()
  @RequirePermissions(Permission.CREATE_CONTENT, Permission.MANAGE_MEDIA)
  create() {
    // User must have BOTH CREATE_CONTENT AND MANAGE_MEDIA permissions
    return { message: 'Content created' };
  }

  // Example 3: Different permissions for different operations
  @Delete(':id')
  @RequirePermissions(Permission.DELETE_CONTENT)
  delete() {
    // Only users with DELETE_CONTENT permission
    return { message: 'Content deleted' };
  }

  // Example 4: No permission decorator = accessible to all authenticated users
  @Get('public')
  getPublicContent() {
    // Any authenticated user can access (no specific permission needed)
    return { message: 'Public content' };
  }
} */
