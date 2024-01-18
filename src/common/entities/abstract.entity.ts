import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // @Exclude()
  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt!: Date;

  // @Exclude()
  @UpdateDateColumn({
    type: "timestamp",
  })
  updatedAt!: Date;
}
