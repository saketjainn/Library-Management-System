import { Component } from '@angular/core';
import { SearchBookService } from '../../../services/user-service/search-book.service';
import { EnableDisableBookService } from '../../../services/admin-services/enable-disable-book.service';
import { Book } from '../../../interfaces/book';
import { BookRequest } from '../../../interfaces/book-request';
import { BookPagination } from '../../../interfaces/bookPagination';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {BookList} from "../../../interfaces/book-list";
import { NgToastService } from 'ng-angular-popup';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@Component({
  selector: 'app-new-arrivals',
  templateUrl: './new-arrivals.component.html',
  styleUrls: ['./new-arrivals.component.scss']
})
export class NewArrivalsComponent {
  constructor(
    private bookService: SearchBookService,
    private enableDisableBook: EnableDisableBookService,
    private modalService: NgbModal,
    private toast: NgToastService,
    private loader: NgxUiLoaderModule
  ) {}

  ngOnInit(): void {
    this.fetchBooks();
  }
  selectedFilter: string = 'title'; // Default selected filter
  searchTerm: string = '';
  book!: Book | any; // Assuming book is for single book details
  books!: Book[] | any; // Assuming books is for multiple book details
  bookReq: BookRequest = { bookId: 0, weeksRequested: 0 };
  //noOfWeeks: number = 1;
  pageNumber = 0;
  totalPagesArray: number[] = [];
  pageSize = 5;
  totalPages = 0;
  sortBy = 'dateAdded';
  sortDir = 'desc';
  title = '';
  author = '';
  genre = '';

  fetchBooks(): void {
    this.bookService
      .getNewArrivals(this.pageNumber, this.pageSize, this.sortBy, this.sortDir)
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
          this.books = ''
          console.log(err);
        },
      });
  }

  nextPage(): void {
    console.log(this.totalPagesArray);

    if (this.pageNumber < this.totalPages - 1) {
      this.pageNumber++;
      this.rerenderwithFilter()
    }
  }

  prevPage(): void {
    console.log(this.totalPagesArray);
    if (this.pageNumber != 0) {
      this.pageNumber--;
      this.rerenderwithFilter()
    }
  }

  goToPage(page: number): void {
    console.log(this.totalPagesArray);
    if (page > -1 && page < this.totalPages) {
      this.pageNumber = page;
      this.rerenderwithFilter()
    }
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
        console.log('Book request successful!');
        // alert('Book request successful!');
        this.toast.success({detail: "Success Message", summary: "Book request successful", duration: 5000})
        this.rerenderwithFilter()
      },
      error: (err: any) => {
        this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
        console.log(err);
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
    this.rerenderwithFilter()

  }

  rerenderwithFilter() {
      this.fetchBooks();
  }

  closeModal() {
    this.modalService.dismissAll()
  }
}
