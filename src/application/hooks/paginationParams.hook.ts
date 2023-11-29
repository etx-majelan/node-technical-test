import { HookHandlerDoneFunction } from "fastify";
import { BadRequestException, HttpException } from "../exeptions/http.exception";
import PaginationDTO from "../dtos/pagination.dto";

export default function extractPaginationParamsHook(request: any, reply: any, next: HookHandlerDoneFunction) {
    const page = request.query.page ? parseInt(request.query.page as string) : 0;
    const size = request.query.size ? parseInt(request.query.size as string) : 10;

    // calculate number of items to skip
    const skip = page * size;
    const limit = size;
    request.pagination = new PaginationDTO({page, skip, limit});
    next();
}