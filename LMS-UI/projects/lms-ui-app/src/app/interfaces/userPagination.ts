import { User } from "./user";

export interface UserPagination {
    content: User[],
    pageNumber : number,
    pageSize : number,
    totalElements : number,
    totalPages : number,
    isLastPage : boolean
}