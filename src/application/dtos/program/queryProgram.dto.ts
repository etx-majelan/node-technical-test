import { IsArray, IsString } from "class-validator";

export default class QueryProgramDTO {
    @IsString()
    name?: string;

    @IsString()
    coverImage?: string;

    @IsString()
    description?: string;

    constructor(args: {name?: string, coverImage?: string, description?: string}) {
        this.name = args.name;
        this.coverImage = args.coverImage;
        this.description = args.description;
    }
}