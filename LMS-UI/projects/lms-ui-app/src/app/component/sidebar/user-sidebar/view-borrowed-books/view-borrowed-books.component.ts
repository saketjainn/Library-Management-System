import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { BookIssue } from 'projects/lms-ui-app/src/app/interfaces/book-issue';
import { BookIssuePagination } from 'projects/lms-ui-app/src/app/interfaces/book-issue-pagination';
import { SearchBookService } from 'projects/lms-ui-app/src/app/services/user-service/search-book.service';

@Component({
  selector: 'app-view-borrowed-books',
  templateUrl: './view-borrowed-books.component.html',
  styleUrls: ['./view-borrowed-books.component.scss'],
})
export class ViewBorrowedBooksComponent implements OnInit {
  bookIssue: BookIssue[] | any;
  pageNumber = 0;
  totalPagesArray: number[] = [];
  pageSize = 10;
  totalPages = 0;
  sortBy = 'dueDdate';
  sortDir = 'asc';
  dueDates: Date[] = [];

  constructor(
    private userService: SearchBookService,
    private toast: NgToastService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getBorrowedBooks();

    //this.checkDueDate()
  }

  getBorrowedBooks() {
    console.log('Inside getBorrowedBooks()');
    this.userService.getBorrowedBooks(this.pageNumber).subscribe({
      next: (response: any) => {
        this.bookIssue = response.content;
        this.totalPages = response.totalPages;
        for (let i = 1; i <= this.totalPages; i++) {
          this.totalPagesArray[i - 1] = i;
        }
        console.log(this.bookIssue);
        console.log(this.totalPages);
        this.dueDates = this.bookIssue.map(
          (issue: { dueDate: any }) => issue.dueDate
        );
        console.log(this.dueDates);
        this.dueDates.forEach(this.checkDueDate);
      },
      error: (err: any) => {
        this.bookIssue = '';
        this.toast.error({
          detail: 'Error Message',
          summary: err.error.message,
          duration: 5000,
        });
        console.log(err);
      },
    });
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages - 1) {
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

  gotoExploreBooks() {
    this.router.navigate(['user-home/app-request-book'])
  }

  checkDueDate(dueDate: Date | any) {
    const currentDate: Date | any = new Date();

    console.log(currentDate);

  //  const diff = dueDate - currentDate;
  //  console.log(diff);

  // if ()
   

    //const differenceInMs = Math.abs(dueDate - currentDate);

    //const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
    //console.log(differenceInDays);

    // if (differenceInDays)
  }
}
