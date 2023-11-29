import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Media from "./media.entity";
import { Exclude } from "class-transformer";

export const programProperties = [
    'id',
    'name',
    'coverimage',
    'description'
 ]

@Entity()
export default class Program {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text',{nullable:false})
    name: string;

    @Column('text',{nullable:false})
    coverImage: string;
    
    @Column('text',{nullable:false})
    description: string;

    @OneToMany(() => Media, (media) => media.program, {
        eager: false,
    })
    @Exclude({toPlainOnly: true})
    medias: Media[]
  
    constructor(args?: {name?: string, coverImage?: string, description?: string}) {
      this.name = args?.name || "";
      this.coverImage = args?.coverImage || "";
      this.description = args?.description || "";
    }
}