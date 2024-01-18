import { Entity, Column, OneToMany, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../../common/entities/abstract.entity";
import { IsNotEmpty } from "class-validator";
import { Media } from "modules/media/entity/media.entity";
import { User } from "modules/user/entities/user.entity";
import { Expose } from "class-transformer";

interface orderdMedia extends Media {
  position: number;
}
@Entity()
export class Program extends AbstractEntity {
  @Column({ type: "varchar", nullable: true })
  name: string;

  @IsNotEmpty()
  @Column({ type: "varchar" })
  coverImageUrl: string;

  @IsNotEmpty()
  @Column({ type: "varchar" })
  description: string;

  @IsNotEmpty()
  @Column({ type: "simple-array", default: null })
  orderOfMedia: string[];
  // TODO: The order of medias matter. It should be possible to change the order of medias inside a program.

  /**
   * Relations
   */

  @OneToMany(() => Media, (media) => media.progam)
  media: Media[];

  @ManyToOne(() => User, (user) => user.programsCurated)
  curator: User;

  // HOOKS
  @Expose()
  mediaOrderList(): Media[] {
    if (this.orderOfMedia.length < 1) return this.media;
    return this.orderOfMedia?.reduce((acc: Media[], id: string) => {
      const match = this.media.filter((media) => media.id === id);
      return acc.concat(...match);
    }, []);
  }
}
