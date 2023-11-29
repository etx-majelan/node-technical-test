import extractSortParamsHook from "./sortParams.hook";
import { BadRequestException,  } from "../exeptions/http.exception";
import SortDTO from "@application/dtos/sort.dto";

describe("extractSortParamsHook", () => {
    let request: any;
    let reply: any;
    let next: jest.Mock;
    let properties: string[];

    beforeEach(() => {
        request = {
            query: {},
        };
        reply = {};
        next = jest.fn();
        properties = ["property1", "property2"];
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should call next without setting request.sort if sort query param is not provided", () => {
        extractSortParamsHook(request, reply, next, properties);

        expect(next).toHaveBeenCalledTimes(1);
        expect(request.sort).toBeUndefined();
    });

    it("should call next with BadRequestException if orderBy is provided and orderDirection is not", () => {
        request.query.orderBy = "property1";

        extractSortParamsHook(request, reply, next, properties);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(new BadRequestException("Invalid sort parameters: Provide both orderBy and orderDirection or neither"));
        expect(request.sort).toBeUndefined();
    });

    it("should call next with BadRequestException if orderDirection is provided and orderBy is not", () => {
        request.query.orderDirection = "DESC";

        extractSortParamsHook(request, reply, next, properties);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(new BadRequestException("Invalid sort parameters: Provide both orderBy and orderDirection or neither"));
        expect(request.sort).toBeUndefined();
    });

    it("should call next with BadRequestException if orderBy is invalid", () => {
        request.query.orderBy = "invalidProperty";
        request.query.orderDirection = "DESC";

        extractSortParamsHook(request, reply, next, properties);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(new BadRequestException("Invalid sort parameters: invalidProperty"));
        expect(request.sort).toBeUndefined();
    });

    it("should set request.sort if orderBy and orderDirection are valid", () => {
        request.query.orderBy = "property1";
        request.query.orderDirection = "DESC";

        extractSortParamsHook(request, reply, next, properties);

        expect(next).toHaveBeenCalledTimes(1);
        expect(request.sort).toEqual(new SortDTO("property1", "DESC"));
    });
});
