import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger('AuthGuard'); // Set context name

  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    this.logger.debug(`[Checking Auth] ${method} ${url}`);

    // 1. Convert headers
    const headers = fromNodeHeaders(request.headers);

    // 2. Extract Token Sources for Logging
    const cookieToken = request.cookies?.['better-auth.session_token'];
    const authHeader = request.headers['authorization'];
    let tokenToValidate = cookieToken;

    // 3. Handle Bearer Token Logic
    if (!tokenToValidate && authHeader?.startsWith('Bearer ')) {
      tokenToValidate = authHeader.split(' ')[1];
      this.logger.verbose(
        `Found Bearer token in Authorization header: ${tokenToValidate.substring(0, 10)}...`,
      );
      // Inject into headers so Better-Auth detects it
      headers.set('cookie', `better-auth.session_token=${tokenToValidate}`);
    } else if (tokenToValidate) {
      this.logger.verbose(
        `Found token in Cookies: ${tokenToValidate.substring(0, 10)}...`,
      );
    }

    if (!tokenToValidate) {
      this.logger.warn(
        `No token found in either Cookies or Authorization header for ${url}`,
      );
      throw new UnauthorizedException('Authentication credentials missing');
    }

    try {
      // 4. Call Better-Auth API
      this.logger.debug('Validating session with Better-Auth API...');
      const session = await this.authService.auth.api.getSession({
        headers: headers,
      });

      // 5. Success/Failure Logging
      if (!session) {
        this.logger.error(
          `Validation Failed: Token exists but no session found in DB for token starting with: ${tokenToValidate.substring(0, 8)}`,
        );
        throw new UnauthorizedException('Session invalid or expired');
      }

      this.logger.log(
        `Auth Success: User [${session.user.email}] (ID: ${session.user.id})`,
      );

      // 6. Attach to request
      request['user'] = session.user;
      request['session'] = session.session;

      return true;
    } catch (error) {
      this.logger.error(`Critical Auth Error: ${error.message}`, error.stack);

      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Internal Authentication Error');
    }
  }
}
