import { Book } from "./book";

export interface BookPagination {
    content: Book[],
    pageNumber : number,
    pageSize : number,
    totalElements : number,
    totalPages : number,
    isLastPage : boolean
}