import { Fine } from "./fine";

export interface FinePagination {
    content : Fine[],
    pageNumber : number,
    pageSize : number,
    totalElements : number,
    totalPages : number,
    isLastPage : boolean
}