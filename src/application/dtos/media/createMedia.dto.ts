import { IsString, IsNumber } from 'class-validator';

export default class CreateMediaDTO {
    @IsString()
    name: string;

    @IsString()
    file: string;

    @IsNumber()
    duration: number;

    @IsString()
    description?: string;

    @IsNumber()
    programId?: number;

    constructor(args: {name: string, file: string, duration: number, description?: string, programId?: number}) {
        this.name = args.name;
        this.file = args.file;
        this.duration = args.duration;
        this.description = args.description;
        this.programId = args.programId;
    }

    // static toEntity(args: CreateMediaDto): Media {
    //     classToPlain
    //     return new CreateMediaDto(args);
    // }
}