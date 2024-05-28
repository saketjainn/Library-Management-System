import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';

import { Book } from 'projects/lms-ui-app/src/app/interfaces/book';
import { BookList } from 'projects/lms-ui-app/src/app/interfaces/book-list';
import { BookPagination } from 'projects/lms-ui-app/src/app/interfaces/bookPagination';
import { AddBookService } from 'projects/lms-ui-app/src/app/services/admin-services/add-book.service';
import { EnableDisableBookService } from 'projects/lms-ui-app/src/app/services/admin-services/enable-disable-book.service';
import { SearchBookService } from 'projects/lms-ui-app/src/app/services/user-service/search-book.service';
import {ConfirmationModalService} from "projects/lms-ui-app/src/app/component/confirmation-modal/confirmation-modal.service";


EnableDisableBookService;

@Component({
  selector: 'app-manage-books',
  templateUrl: './manage-books.component.html',
  styleUrls: ['./manage-books.component.scss'],
})
export class ManageBooksComponent implements OnInit {
  searchHelper() {
    throw new Error('Method not implemented.');
  }
  constructor(
    private bookService: SearchBookService,
    private enableDisableBook: EnableDisableBookService,
    private getAllBooks: AddBookService,
    private toast: NgToastService,
    private confirmationDialogService: ConfirmationModalService,

  ) {}

  ngOnInit(): void {
    this.fetchBooks();
  }

  selectedFilter: string = 'title';
  searchTerm: string = '';
  book!: Book | any;
  books!: BookList | any;
  currentBookId: number | any;
  pageNumber = 0;
  totalPagesArray: number[] = [];
  pageSize = 10;
  totalPages = 0;
  sortBy = 'bookId';
  sortDir = 'asc';
  title = '';
  author = '';
  genre = '';
  id = 0;
  flag: string = 'plus'

  fetchBooks(): void {
    this.getAllBooks
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
          console.log(this.totalPagesArray);
        },
        error: (err) => {
          this.books = '';
          this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
          console.log(err);
        },
      });
  }

  search() {
    if (this.searchTerm == '') {
      this.fetchBooks()
    }
    if (this.selectedFilter === 'title') {
      this.title = this.searchTerm;
      this.pageNumber = 0;
      this.totalPagesArray = [];
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
          //this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
          console.log(err);
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
          //this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
          console.log(err);
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
          //this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
          console.log(err);
        },
      });
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages - 1) {
      this.pageNumber++;
      this.rerenderWithFilter();
    }
  }

  prevPage(): void {
    if (this.pageNumber != 0) {
      this.pageNumber--;
      this.rerenderWithFilter();
    }
  }

  goToPage(page: number): void {
    if (page > -1 && page < this.totalPages) {
      this.pageNumber = page;
      this.rerenderWithFilter();
    }
  }

  toggleEnableDisable(id: number) {
    console.log('Inside toggleEnableDisable, id = ' + id);
    this.enableDisableBook.enableDisableBook(id).subscribe({
      next: (response: boolean) => {
        if (response) {
          //alert('Book id : ' + id + ' disabled');
          this.toast.success({detail: "Success Message", summary: "Book id : "+id+" disabled", duration: 5000})
        } else {
          //alert('Book id : ' + id + ' enabled');
          this.toast.success({detail: "Success Message", summary: "Book id : "+id+" enabled", duration: 5000})
        }
        console.log(response);
        this.rerenderWithFilter();
        //this.helper(id);
      },
      error: (err) => {
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
    this.rerenderWithFilter();
  }

  deleteBookModal(id: number) {}

  deleteBook(id: number) {
    this.getAllBooks.deleteBook(id).subscribe({
      next: (res: boolean) => {
        if (res) {
          //console.log('Book Id: ', id, ' deleted successfully');
          this.toast.success({detail: "Success Message", summary: "Book id : "+id+" deleted successfully", duration: 5000})
        } else {
          //console.log('Book Id: ', id, ' deletion unsuccessfull');
          this.toast.error({detail: "Error Message", summary: "Book id : "+id+" deletion unsuccessful", duration: 5000})
        }
        this.rerenderWithFilter();
      },
      error: (err: any) => {
        console.log(err.error.message);
        this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
      },
    });
  }

  rerenderWithFilter() {
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
  public openConfirmationDialog(id: number) {
    this.confirmationDialogService.confirm('', 'Do you really want to delete the book ?')
      .then((confirmed) => confirmed?this.deleteBook(id):void(0))
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  increase(book: Book) {
    console.log(book.quantityAvailable);
    // this.flag = 'plus'
    if (book.quantityAvailable == 100) {
      return
    }
   book.quantityAvailable++;
    console.log(book.quantityAvailable);
    this.updateBook(book)
    //this.updateBook(book);
    //this.quantityUpdate.getAllBooks()
  }

  decrease(book: Book) {
    console.log(book.quantityAvailable);
    if (book.quantityAvailable == 1) {
      return
    }
    book.quantityAvailable--;
    // this.flag = 'minus'
    console.log(book.quantityAvailable);
    this.updateBook(book)
    //this.quantityUpdate.getAllBooks()
    //this.updateBook(book);
  }

  updateBook(book: Book) {

    console.log(book.quantityAvailable);
    this.getAllBooks.updateBook(book).subscribe({
      next: (res: any) => {
        console.log(book.quantityAvailable);
      },
      error: (err: any) => {
        console.log(err);
        this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
      },
    });
    //this.fetchBooks()
  }



  // editQuantity(book: Book) {
  //   const modalRef = this.modalService.open(UpdateQuantityModalComponent, {centered: true});
  //   modalRef.componentInstance.book = book
  // }


}
