import { User } from "modules/user/entities/user.entity";
import { DeepPartial } from "typeorm";

export const getData = (): DeepPartial<User> => {
  return {
    email: process.env.USER_ALPHA,
    username: "cecil01",
    password: process.env.USER_ALPHA_PSS,
  };
};
