import { IsNumber, IsString } from "class-validator";

export default class QueryMediaDTO {
    @IsString()
    name?: string;

    @IsNumber()
    maxDuration?: number;

    @IsNumber()
    minDuration?: number;

    @IsString()
    description?: string;

    @IsNumber()
    program?: number;

    constructor(args: {name?: string, description?:string, maxDuration?: number, minDuration?: number, program?: number}) {
        this.name = args.name;
        this.maxDuration = args.maxDuration || 10;
        this.minDuration = args.minDuration || 0;
        this.program = args.program;
    }
}