import { Exclude } from "class-transformer";
import { IsEmail } from "class-validator";
import { AbstractEntity } from "common/entities/abstract.entity";
import { generateHash } from "helpers/utils";
import { Media } from "modules/media/entity/media.entity";
import { Program } from "modules/program/entity/program.entity";
import { Column, BeforeInsert, OneToMany, Entity } from "typeorm";

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
export enum UserRole {
  SUPERADMIN = "superadmin",
  USER = "user",
  ALL = "all",
}
@Entity()
export class User extends AbstractEntity {
  @Column({ unique: true, type: "varchar" })
  @IsEmail()
  email: string;

  @Column({ type: "varchar" })
  username: string;

  @Exclude()
  @Column({ type: "varchar", select: false })
  password: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  // Hooks
  @BeforeInsert()
  hashPassword(): void {
    this.password = generateHash(this.password);
  }

  //Relations
  @OneToMany(() => Media, (media) => media.author)
  mediaPosted: Media[];

  @OneToMany(() => Program, (prog) => prog.curator)
  programsCurated: Program;
}
