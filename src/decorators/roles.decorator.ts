import { CustomDecorator, SetMetadata } from "@nestjs/common";
import { UserRole } from "modules/user/entities/user.entity";

export const Roles = (...roles: UserRole[]): CustomDecorator<string> =>
  SetMetadata("roles", roles);
