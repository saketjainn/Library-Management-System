import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ManageBookRequestsAdmin } from 'projects/lms-ui-app/src/app/interfaces/manage-book-request-admin';
import { ViewRequestUser } from 'projects/lms-ui-app/src/app/interfaces/view-request-user';
import { SearchBookService } from 'projects/lms-ui-app/src/app/services/user-service/search-book.service';

@Component({
  selector: 'app-view-my-requests',
  templateUrl: './view-my-requests.component.html',
  styleUrls: ['./view-my-requests.component.scss'],
})
export class ViewMyRequestsComponent implements OnInit {
  myRequests: ManageBookRequestsAdmin[] | any;
  pageNumber = 0;
  pageSize = 10
  totalPagesArray: number[] = [];
  totalPages = 0;
  sortBy = 'requestDate';
  sortDir = 'desc'
  constructor(private userService: SearchBookService, private toast: NgToastService, private router: Router) {}

  ngOnInit(): void {
    this.viewRequests();
  }

  viewRequests() {
    this.userService.viewRequest(this.pageNumber, this.pageSize, this.sortBy, this.sortDir).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.myRequests = resp.content;
        this.totalPages = resp.totalPages;
        for (let i = 1; i <= this.totalPages ; i++) {
          this.totalPagesArray[i - 1] = i;
        }
      },
      error: (err) => {
        this.myRequests = ''
        // this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
        //console.log(err);
      },
    });
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages-1) {
      this.pageNumber++;
      this.viewRequests();
    }
  }

  prevPage(): void {
    if (this.pageNumber != 0) {
      this.pageNumber--;
      this.viewRequests();
    }
  }

  goToPage(page: number): void {
    if (page > -1 && page < this.totalPages) {
      this.pageNumber = page;
      this.viewRequests();
    }
  }

  cancelRequest(reqId: number) {
    this.userService.cancelRequest(reqId).subscribe({
      next: (res: Boolean) => {
        //alert('Request Cancelled!');
        this.toast.success({detail: "Success Message", summary: "Request with request id: "+reqId+" cancelled", duration: 5000})
        this.viewRequests()
      },
      error: (err: any) => {
        this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
        //console.log(err)
      }
    });
  }

  gotoExploreBooks() {
    this.router.navigate(['user-home/app-request-book'])
  }
}
