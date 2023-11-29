import PaginationDTO from "@application/dtos/pagination.dto";
import { BadRequestException } from "@application/exeptions/http.exception";
import extractPaginationParamsHook from "./paginationParams.hook";

describe("extractPaginationParamsHook", () => {
    let request: any;
    let reply: any;
    let next: jest.Mock;

    beforeEach(() => {
        request = {
            query: {},
        };
        reply = {};
        next = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should set default pagination params when no query params are not provided", () => {
        extractPaginationParamsHook(request, reply, next);

        expect(request.pagination).toEqual(new PaginationDTO({ page: 0, skip: 0, limit: 10 }));
        expect(next).toHaveBeenCalled();
    });

    it("should set pagination params based on query params", () => {
        request.query.page = "2";
        request.query.size = "20";

        extractPaginationParamsHook(request, reply, next);

        expect(request.pagination).toEqual(new PaginationDTO({ page: 2, skip: 40, limit: 20 }));
        expect(next).toHaveBeenCalled();
    });
});
