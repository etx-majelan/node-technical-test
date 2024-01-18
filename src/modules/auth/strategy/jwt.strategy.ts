import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { AuthService } from "../auth.service";
import { UserService } from "modules/user/user.service";
import { User } from "modules/user/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly authService: AuthService,
    private userservice: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      algorithms: ["HS256"],
    });
  }

  /**
   * @description Validate the token and return the user
   * @param payload string
   * @returns User
   */
  async validate(payload: any): Promise<User | HttpException> {
    const user = await this.userservice.findOne({
      where: { email: payload.email },
    });

    if (!user) throw new HttpException("Invalid user", HttpStatus.UNAUTHORIZED);
    return user;
  }
}
