import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { Book } from 'projects/lms-ui-app/src/app/interfaces/book';
import { BookList } from 'projects/lms-ui-app/src/app/interfaces/book-list';
import { BookRequest } from 'projects/lms-ui-app/src/app/interfaces/book-request';
import { BookPagination } from 'projects/lms-ui-app/src/app/interfaces/bookPagination';
import { AddBookService } from 'projects/lms-ui-app/src/app/services/admin-services/add-book.service';
import { EnableDisableBookService } from 'projects/lms-ui-app/src/app/services/admin-services/enable-disable-book.service';
import { SearchBookService } from 'projects/lms-ui-app/src/app/services/user-service/search-book.service';

@Component({
  selector: 'app-request-book',
  templateUrl: './request-book.component.html',
  styleUrls: ['./request-book.component.scss'],
})
export class RequestBookComponent implements OnInit {
  constructor(
    private bookService: SearchBookService,
    private enableDisableBook: EnableDisableBookService,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.fetchBooks();

  }
  selectedFilter: string = 'title'; // Default selected filter
  searchTerm: string = '';
  // book!: Book | any; // Assuming book is for single book details
  books!: Book[] | any; // Assuming books is for multiple book details
  bookReq: BookRequest = { bookId: 0, weeksRequested: 0 };
  //noOfWeeks: number = 1;
  pageNumber = 0;
  totalPagesArray: number[] = [];
  pageSize = 10;
  totalPages = 0;
  sortBy = 'title';
  sortDir = 'asc';
  title = '';
  author = '';
  genre = '';
  // tooltipsMessage: string = 'Select duration'



  fetchBooks(): void {
    this.bookService
      .getAllBooks(this.pageNumber, this.pageSize, this.sortBy, this.sortDir)
      .subscribe({
        next: (response: BookPagination) => {
          this.books = response.content;
          console.log(this.books);
          this.totalPages = response.totalPages;
          for (let i = 1; i <= this.totalPages; i++) {
            this.totalPagesArray[i - 1] = i;
          }
          console.log(this.totalPages);
        },
        error: (err) => {
          this.books = '';
          // this.toast.error({
          //   detail: 'Error Message',
          //   summary: err.error.message,
          //   duration: 5000,
          // });
          //console.log(err);
        },
      });
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages - 1) {
      this.pageNumber++;
      this.rerenderwithFilter();
    }
  }

  prevPage(): void {
    if (this.pageNumber != 0) {
      this.pageNumber--;
      this.rerenderwithFilter();
    }
  }

  goToPage(page: number): void {
    if (page > -1 && page < this.totalPages) {
      this.pageNumber = page;
      this.rerenderwithFilter();
    }
  }

  search() {
    if (this.searchTerm == '') {
      this.fetchBooks();
    }
    if (this.selectedFilter === 'title') {
      this.title = this.searchTerm;
      this.pageNumber = 0;
      this.totalPagesArray = [];
      this.sortBy = 'title';
      this.searchBookByTitle();
    } else if (this.selectedFilter === 'author') {
      this.author = this.searchTerm;
      this.pageNumber = 0;
      this.totalPagesArray = [];
      this.sortBy = 'author';
      this.searchBookByAuhtorName();
    } else if (this.selectedFilter === 'genre') {
      this.genre = this.searchTerm;
      this.genre = this.genre.trim().replace(/ /g, '_');
      console.log(this.genre);

      this.pageNumber = 0;
      this.totalPagesArray = [];
      this.sortBy = 'genre';
      this.searchBookByGenre();
    } else if (this.selectedFilter === '') {
      console.log('Inside else block');
      return;
    }
  }

  searchBookByTitle(): void {
    this.bookService
      .searchBookByTitle(
        this.title,
        this.pageNumber,
        this.pageSize,
        this.sortBy,
        this.sortDir
      )
      .subscribe({
        next: (response: BookPagination) => {
          this.books = response.content;
          console.log(this.books);
          this.totalPages = response.totalPages;
          for (let i = 1; i <= this.totalPages; i++) {
            this.totalPagesArray[i - 1] = i;
          }
          console.log(this.totalPages);
          console.log(this.totalPagesArray);

        },
        error: (err) => {
          this.books = '';
          // this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
          //console.log(err);
        },
      });
  }

  searchBookByAuhtorName(): void {
    this.bookService
      .searchBookByAuthorName(
        this.author,
        this.pageNumber,
        this.pageSize,
        this.sortBy,
        this.sortDir
      )
      .subscribe({
        next: (response: BookPagination) => {
          this.books = response.content;
          console.log(this.books);
          this.totalPages = response.totalPages;
          for (let i = 1; i <= this.totalPages; i++) {
            this.totalPagesArray[i - 1] = i;
          }

          console.log(this.totalPages);
          console.log(this.totalPagesArray);
        },
        error: (err) => {
          this.books = '';
          // this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
          //console.log(err);
        },
      });
  }

  searchBookByGenre(): void {
    this.bookService
      .searchBookByGenre(
        this.genre,
        this.pageNumber,
        this.pageSize,
        this.sortBy,
        this.sortDir
      )
      .subscribe({
        next: (response: BookPagination) => {
          this.books = response.content;
          console.log(this.books);
          this.totalPages = response.totalPages;
          for (let i = 1; i <= this.totalPages; i++) {
            this.totalPagesArray[i - 1] = i;
          }
          console.log(this.totalPages);
          console.log(this.totalPagesArray);
        },
        error: (err) => {
          this.books = '';
          // this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
          //console.log(err);
        },
      });
  }

  helper(book: Book): void {
    console.log('Inside helper, id = ' + book.bookId);
    this.bookReq.bookId = book.bookId;
    this.bookReq.weeksRequested = book.noOfWeeks;
    console.log(this.bookReq.weeksRequested);
    this.requestBook(this.bookReq);
    // this.toggleEnableDisable(book.bookId);
  }

  requestBook(bookReq: BookRequest) {
    this.bookService.issueBookRequest(bookReq).subscribe({
      next: (res: boolean) => {
        // console.log('Book request successful!');
        // alert('Book request successful!');
        this.toast.success({
          detail: 'Success Message',
          summary: 'Book request successful!',
          duration: 5000,
        });
        this.rerenderwithFilter();
      },
      error: (err: any) => {
        this.toast.error({
          detail: 'Error Message',
          summary: err.error.message,
          duration: 5000,
        });
        //console.log(err);
      },
    });
  }

  switchSortBy(sortBy: string) {
    if (sortBy == this.sortBy) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortDir = 'asc';
    }
    this.rerenderwithFilter();
  }

  rerenderwithFilter() {
    if (this.selectedFilter == 'title') {
      this.searchBookByTitle();
    } else if (this.selectedFilter == 'author') {
      this.searchBookByAuhtorName();
    } else if (this.selectedFilter == 'genre') {
      this.searchBookByGenre();
    } else {
      this.fetchBooks();
    }
  }



}
