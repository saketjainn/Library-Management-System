import { Component, Input, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { BookIssue } from 'projects/lms-ui-app/src/app/interfaces/book-issue';
import { User } from 'projects/lms-ui-app/src/app/interfaces/user';
import { AddBookService } from 'projects/lms-ui-app/src/app/services/admin-services/add-book.service';
import { SearchBookService } from 'projects/lms-ui-app/src/app/services/user-service/search-book.service';

@Component({
  selector: 'app-view-borrowed-books-modal',
  templateUrl: './view-borrowed-books-modal.component.html',
  styleUrls: ['./view-borrowed-books-modal.component.scss']
})
export class ViewBorrowedBooksModalComponent implements OnInit {

  @Input() user: User | any;
  username: string = '';

  bookIssue: BookIssue[] | any;
  pageNumber = 0;
  totalPagesArray: number[] = [];
  pageSize = 10;
  totalPages = 0;
  sortBy = 'title';
  sortDir = 'asc';
  isElementPresent = true;

  constructor(private adminService: AddBookService, private toast: NgToastService) {}
  ngOnInit(): void {
    this.username = this.user.username;
    this.getBorrowedBooks();
  }

  returnBook(issueId: number) {
    console.log('Inside returnBook()');
    this.adminService.returnBook(issueId).subscribe({
      next: (response: boolean) => {

        if(response){
        //alert('Book returned successfully');
        this.toast.success({detail: "Error Message", summary: "Book with issue id: "+issueId+" returned successfully", duration: 5000})
        }
        this.getBorrowedBooks();
      },
      error: (err: any) => {
        this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
        console.log(err);

      },
    });
  }

  getBorrowedBooks() {
    console.log('Inside getBorrowedBooks()');
    this.adminService.getBorrowedBooks(this.pageNumber,this.username).
    subscribe({
      next: (response: any) => {
        this.bookIssue = response.content;
        this.totalPages = response.totalPages;
        for (let i = 1; i <= this.totalPages ; i++) {
          this.totalPagesArray[i - 1] = i;
        }
        console.log(this.bookIssue);
        console.log(this.totalPages);
      },
      error: (err: any) => {
        this.bookIssue = ''
        this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
        console.log(err);
      },
    });
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages-1) {
      this.pageNumber++;
      this.getBorrowedBooks();
    }
  }

  prevPage(): void {
    if (this.pageNumber != 0) {
      this.pageNumber--;
      this.getBorrowedBooks();
    }
  }

  goToPage(page: number): void {
    if (page > -1 && page < this.totalPages) {
      this.pageNumber = page;
      this.getBorrowedBooks();
    }
  }


}
