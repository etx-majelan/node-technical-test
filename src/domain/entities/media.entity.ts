import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Program from "./program.entity";
import { Transform } from "class-transformer";

export const mediaProperties = [
    'id',
    'name',
    'file',
    'duration',
    'description'
]

@Entity()
export default class Media {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text',{nullable:false})
    name: string;

    @Column('text',{nullable:false})
    file: string;
    
    @Column('float',{nullable:false})
    duration: number;
    
    @Column('text',{nullable:true})
    description?: string | null;
 
    @ManyToOne((type) => Program, (program) => program.medias, {
        eager: false,
        onDelete: "SET NULL"
    })
    @JoinColumn()
    @Transform(({ value }) => value?.id || null, { toPlainOnly: true })
    program?: Program;

    constructor(args?: {name: string, file: string, duration: number, description?: string | null, programId?: number, program?: Program}) {
        this.name = args?.name || '';
        this.file = args?.file || '';
        this.duration = args?.duration || 0;
        this.description = args?.description || null;
        if (args?.program) this.program = args.program;
    }
}
