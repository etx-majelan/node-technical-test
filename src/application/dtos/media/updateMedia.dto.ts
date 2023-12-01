import { IsNumber, IsString } from "class-validator";

export default class UpdateMediaDTO {
    @IsString()
    name?: string;

    @IsString()
    file?: string;

    @IsNumber()
    duration?: number;

    @IsString()
    description?: string;

    @IsNumber()
    program?: number;

    constructor(args: {name?: string, file?: string, duration?: number, description?: string, program?: number }) {
        this.name = args?.name;
        this.file = args?.file;
        this.duration = args?.duration;
        this.description = args?.description;
        this.program = args?.program;
    }
}