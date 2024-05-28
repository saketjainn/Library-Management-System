import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/env';
import { Book } from '../../interfaces/book';
import { BookList } from '../../interfaces/book-list';
import { Observable } from 'rxjs';
import { BookRequest } from '../../interfaces/book-request';
import { ViewMyRequestsComponent } from '../../component/sidebar/user-sidebar/view-my-requests/view-my-requests.component';
import { ViewRequestUser } from '../../interfaces/view-request-user';
import { BookPagination } from '../../interfaces/bookPagination';
import { UserPagination } from '../../interfaces/userPagination';
import { BookIssuePagination } from '../../interfaces/book-issue-pagination';
import { FinePagination } from '../../interfaces/finePagination';

@Injectable({
  providedIn: 'root',
})
export class SearchBookService {
  getUserProfile(): Observable<any> {
    const url = `${this.env.serverUrl}${this.env.userUrlPrefix}/get-user-details`;
    return this.http.get<any>(url);
  }
  constructor(private http: HttpClient) {}

  env = environment;

  searchBookByTitle(
    title: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDir: string
  ) {
    const url = `${this.env.serverUrl}${this.env.userUrlPrefix}/get-book-List-by-title`;
    const params = {
      title: title,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      sortBy: sortBy,
      sortDir: sortDir,
    };
    console.log('request sent from service');
    return this.http.get<BookPagination>(url, { params });
  }

  searchBookByAuthorName(
    author: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDir: string
  ) {
    const url = `${this.env.serverUrl}${this.env.userUrlPrefix}/get-book-by-authorName`;
    const params = {
      author: author,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      sortBy: sortBy,
      sortDir: sortDir,
    };
    console.log('request sent from service');
    return this.http.get<BookPagination>(url, { params });
  }
  searchBookByGenre(
    genre: string,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDir: string
  ) {
    const url = `${this.env.serverUrl}${this.env.userUrlPrefix}/get-book-by-genre`;
    const params = {
      genre: genre,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      sortBy: sortBy,
      sortDir: sortDir,
    };
    console.log('request sent from service');
    return this.http.get<BookPagination>(url, { params });
  }


  searchBookById(id: number) {
    const url = `${this.env.serverUrl}${this.env.userUrlPrefix}/get-book-by-id`;
    const params = {id: id}
    return this.http.get<Book>(url, {params})
  }

  issueBookRequest(book: BookRequest): Observable<boolean> {
    const url = `${this.env.serverUrl}${this.env.userUrlPrefix}/request-book`;
    return this.http.post<boolean>(url, book);
  }

  viewRequest(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDir: string
  ) {
    const url = `${this.env.serverUrl}${this.env.userUrlPrefix}/view-requests`;
    const params = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      sortBy: sortBy,
      sortDir: sortDir,
    };
    return this.http.get<any>(url, { params });
  }

  getAllBooks(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDir: string
  ) {
    const url = `${this.env.serverUrl}${this.env.userUrlPrefix}/view-all-books`;
    const params = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      sortBy: sortBy,
      sortDir: sortDir,
    };
    console.log('request sent from service');
    return this.http.get<BookPagination>(url, { params });
  }

  getNewArrivals(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDir: string
  ) {
    console.log ('inside getNewArrivals service')
    const url = `${this.env.serverUrl}${this.env.userUrlPrefix}/newArrivals`;
    const params = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      sortBy: sortBy,
      sortDir: sortDir,
    };
    console.log('request sent from service');
    return this.http.get<BookPagination>(url, { params });
  }

  cancelRequest(reqId: number) {
    const url = `${this.env.serverUrl}${this.env.userUrlPrefix}/cancel-request`;
    const params = { requestId: reqId.toString() };
    return this.http.get<Boolean>(url, { params });
  }

  //check pagination
  getBorrowedBooks(pageNumber: number, pageSize: number = 10, sortBy: string = 'dueDate', sortDir = 'asc' ) {
    const params = { pageNumber: pageNumber.toString(), pageSize: pageSize,sortBy: sortBy, sortDir: sortDir };
    const url = `${this.env.serverUrl}${this.env.userUrlPrefix}/view-borrowed-books`;

    return this.http.get<any>(url, { params });
  }

  getfines(pageNumber: number, pageSize: number) {
    const url = `${this.env.serverUrl}${this.env.userUrlPrefix}/fines`;
    const params = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    };

    console.log('request sent from service');
    return this.http.get<FinePagination>(url, { params });
  }

  getUserDashboardData() {
    const url = `${this.env.serverUrl}${this.env.userUrlPrefix}/user-dashboard`;
    return this.http.get<any>(url)
  }

  updateUser(user: any) {
    const url = `${this.env.serverUrl}${this.env.userUrlPrefix}/update-user`;
    return this.http.put<any>(url, user)
  }

}
