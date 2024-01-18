import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { AbstractEntity } from "../../../common/entities/abstract.entity";
import { IsNotEmpty } from "class-validator";
import { Program } from "modules/program/entity/program.entity";
import { User } from "modules/user/entities/user.entity";

export enum MediaType {
  AUDIO = "audio",
}

@Entity()
export class Media extends AbstractEntity {
  @Column({ type: "varchar", nullable: true })
  name: string;

  @IsNotEmpty()
  @Column({ type: "varchar" })
  description: string;

  @Column({ type: "varchar" })
  fileUrl: string;

  @Column({
    type: "varchar",
  })
  duration: string;

  /**
   * Relations
   */

  @ManyToOne(() => Program, (program) => program.media)
  @JoinColumn()
  progam: Program;

  @ManyToOne(() => User, (user: User) => user.mediaPosted)
  @JoinTable()
  author: User;

  @ManyToMany(() => User)
  @JoinTable()
  seenBy: User[];
}
