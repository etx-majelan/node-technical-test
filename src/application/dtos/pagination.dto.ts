export default class PaginationDTO {
    page: number;
    limit: number;
    skip: number;

    constructor(arg?: {page?: number, skip?: number, limit?: number}) {
        this.page = arg?.page || 0;
        this.limit = arg?.limit || 10;
        this.skip = arg?.skip || 0;
    }
}