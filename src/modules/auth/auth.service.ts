import { HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { validateHash } from "helpers/utils";
import _ from "lodash";
import { UserService } from "modules/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<Record<string, any>> {
    const userDetails = await this.userService.findOne({
      select: ["username", "password", "email", "id"],
      where: { email },
    });
    if (!userDetails) {
      throw new HttpException("Invalid credentials", 401);
    }

    // Check if the given password match with saved password
    const isValid = await validateHash(password, userDetails.password);
    const cloneData = _.omit(userDetails, ["password"]);
    return isValid
      ? {
          token: this.jwtService.sign(
            {
              email: userDetails.email,
              sub: userDetails.id,
            },
            {
              expiresIn: "3d",
            }
          ),

          user: cloneData,
        }
      : new HttpException("username or password not valid", 401);
  }
}
