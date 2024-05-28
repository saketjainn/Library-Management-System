import { BookIssue } from "./book-issue";

export interface BookIssuePagination {
    content : BookIssue[],
    pageNumber : number,
    pageSize : number,
    totalElements : number,
    totalPages : number,
    isLastPage : boolean
}