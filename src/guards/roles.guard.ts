import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { getAction } from "@rewiko/crud";
import { User, UserRole } from "modules/user/entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this._reflector.get<string[]>("roles", context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    if (!request.user) throw new UnauthorizedException();
    const { role } = <User>request.user;
    return roles.includes(role);
  }
}

@Injectable()
export class RestCrudGuard implements CanActivate {
  private currentUser: User;
  constructor(
    public rolesForRoutes: {
      "Read-One": string[];
      "Read-All": string[];
      "Create-One": string[];
      "Create-Many": string[];
      "Update-One": string[];
      "Replace-One": string[];
      "Delete-One": string[];
    }
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();

    const action = getAction(handler);
    if (!action) return true;

    this.currentUser = <User>request.user;

    return this.checkRole(this.rolesForRoutes[action]);
  }

  checkRole(rolesPermittedForRoute: string[]): boolean {
    if (rolesPermittedForRoute.length === 0) return false;
    return (
      rolesPermittedForRoute.includes(UserRole.ALL) ||
      rolesPermittedForRoute.includes(this.currentUser.role)
    );
  }
}
