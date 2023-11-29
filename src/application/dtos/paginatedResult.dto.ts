export default class PaginatedResultDTO<T> {
    items: T[];
    totalItems: number;
    totalPages: number;
    page: number;
    size: number;

    constructor(args: { items: T[], totalItems: number, totalPages: number, page: number, size: number }) {
        this.items = args.items;
        this.totalItems = args.totalItems;
        this.totalPages = args.totalPages;
        this.page = args.page;
        this.size = args.size;
    }
}