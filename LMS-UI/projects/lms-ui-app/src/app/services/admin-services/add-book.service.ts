import { Injectable } from '@angular/core';
import { environment } from '@environments/env';
import { Book } from '../../interfaces/book';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BookPagination } from '../../interfaces/bookPagination';
import { UserPagination } from '../../interfaces/userPagination';

@Injectable({
  providedIn: 'root',
})
export class AddBookService {


  getfines(pageNumber: number, username: string) {
    const url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/fines`;
    const params = {
      pageNumber: pageNumber.toString(),
      username: username
    };
    return this.http.get<any>(url, {params})

  }



  env = environment;
  constructor(private http: HttpClient) {}

  addBook(book: Book): Observable<any> {
    console.log("Add Book Called");

    const url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/add-book`;

    return this.http.post(url, book);
  }

  deleteBook(id : number) {
    const url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/delete-book`;
    const params = {bookId : id};
    return this.http.delete<boolean>(url, {params})
  }

  getAllBooks(pageNumber: number = 0, pageSize: number = 10, sortBy: string = 'bookId', sortDir: string = 'asc')  {
    const url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/view-all-books`;
    const params = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      sortBy: sortBy,
      sortDir: sortDir
    };
    return this.http.get<BookPagination>(url, {params})
  }

  getAllUser(pageNumber: number, pageSize: number, sortBy: string = 'username', sortDir: string =  'asc') {
    const url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/view-all-users`;
    const params = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      sortBy: sortBy,
      sortDir: sortDir
    };
    return this.http.get<UserPagination>(url, {params})
  }

  searchUserByUsername(pageNumber: number, username: string, sortBy: string = 'username', sortDir: string =  'asc') {
    const url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/view-user-by-username`;
    const params = {
      pageNumber: pageNumber.toString(),
      username : username,
      sortBy: sortBy,
      sortDir: sortDir
    }
    return this.http.get<any>(url, {params})
  }
  // searchBooks(searchQuery: string, filterQuery: string, pageNumber: number, pageSize: number)  {
  //   const url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/search`;
  //   const params = {
  //     searchQuery: searchQuery,
  //     filterQuery: filterQuery,
  //     pageNumber: pageNumber,
  //     pageSize: pageSize,
  //   };
  //   return this.http.get(url, {params});
  // }
  getBorrowedBooks(pageNumber: number,username: string) {
    console.log('Inside getBorrowedBooks()', pageNumber, username);
    const url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/view-borrowed-books`;
    const params = {
      pageNumber: pageNumber.toString(),
      username: username
    };
    return this.http.get<any>(url, {params});
  }

  returnBook(bookId: number) {
    console.log('Inside returnBook() service', bookId);
    const url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/accept-return`;
    console.log('Inside returnBook()', bookId);
    const params = {
      issueId: bookId
    };
    console.log('Inside params', params);
    return this.http.get<boolean>(url, {params});
  }


  GenerateInvoicePDF() {

    return this.http.get('${this.env.serverUrl}${this.env.adminUrlPrefix}/generate-report?reportName=+BookCollectionReport',{observe:'response',responseType:'blob'});

  }

  updateBook(book: Book) {
    console.log(book.quantityAvailable);
    console.log(book);
    const url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/updateBook`;
    return this.http.post(url, book);
  }

  getPublishers() {
    const url = `${this.env.serverUrl}${this.env.adminUrlPrefix}/view-all-publishers`;
    return this.http.get(url)
  }



}

