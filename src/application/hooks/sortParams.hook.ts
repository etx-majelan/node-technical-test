import { HookHandlerDoneFunction } from "fastify";
import { BadRequestException } from "../exeptions/http.exception";
import SortDTO from "@application/dtos/sort.dto";
import { mediaProperties } from "@domain/entities/media.entity";
import { programProperties } from "@domain/entities/program.entity";

export default function extractSortParamsHook(request: any, reply: any, next: HookHandlerDoneFunction, properties: string[]) {
    const orderBy = request.query.orderBy as string;
    const orderDirection = request.query.orderDirection as string;

    if (!orderBy && !orderDirection) {
        next();
        return;
    }

    if ((orderBy && !orderDirection) || (!orderBy && orderDirection)) {
        return next(new BadRequestException('Invalid sort parameters: Provide both orderBy and orderDirection or neither'));
    }

    if (!properties.includes(orderBy.toLocaleLowerCase())) 
        return next(new BadRequestException(`Invalid sort parameters: ${orderBy}`));

    request.sort = new SortDTO(orderBy, orderDirection);
    next();
}

export function extractSortMediaParamsHook(request: any, reply: any, next: HookHandlerDoneFunction) {
    extractSortParamsHook(request, reply, next, mediaProperties);
}

export function extractSortProgramParamsHook(request: any, reply: any, next: HookHandlerDoneFunction) {
    extractSortParamsHook(request, reply, next, programProperties);
}