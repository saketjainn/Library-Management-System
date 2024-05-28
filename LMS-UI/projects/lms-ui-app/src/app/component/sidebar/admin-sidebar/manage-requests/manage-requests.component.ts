import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { ManageBookRequestsAdmin } from 'projects/lms-ui-app/src/app/interfaces/manage-book-request-admin';
import { EnableDisableBookService } from 'projects/lms-ui-app/src/app/services/admin-services/enable-disable-book.service';


@Component({
  selector: 'app-manage-requests',
  templateUrl: './manage-requests.component.html',
  styleUrls: ['./manage-requests.component.scss'],
})
export class ManageRequestsComponent implements OnInit {
  ngOnInit(): void {
    console.log(this.selectedFilter);
    this.applyFilterOnChange();
  }

  bookReqs: ManageBookRequestsAdmin[] | any;
  pageNumber = 0;
  totalPagesArray: number[] = [];
  pageSize = 10;
  totalPages = 0;
  sortBy = 'requestDate';
  sortDir = 'desc';
  selectedFilter = 'ALL';
  searchTerm = '';
  filterBy: string | null = 'ALL';
  username = '';

  constructor(
    private manageBookService: EnableDisableBookService,
    private toast: NgToastService
  ) {}

  getAllRequests() {
    //this.filterBy = this.selectedFilter
    this.manageBookService
      .getAllRequests(
        this.pageNumber,
        this.pageSize,
        this.sortBy,
        this.sortDir,
        this.filterBy
      )
      .subscribe({
        next: (res: any) => {
          this.bookReqs = res.content;
          this.totalPages = res.totalPages;
          console.log(this.bookReqs);
          console.log(this.totalPages);
          for (let i = 1; i <= this.totalPages; i++) {
            this.totalPagesArray[i - 1] = i;
          }
        },
        error: (err: any) => {
          this.bookReqs = ''
          console.log(err);
          this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
        },
      });
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages - 1) {
      this.pageNumber++;
      //this.getAllRequests();
      this.rerenderWithFilter();
    }
  }

  prevPage(): void {
    if (this.pageNumber != 0) {
      this.pageNumber--;
      //this.getAllRequests();
      this.rerenderWithFilter();
    }
  }

  goToPage(page: number): void {
    if (page > -1 && page < this.totalPages) {
      this.pageNumber = page;
      //this.getAllRequests();
      this.rerenderWithFilter();
    }
  }

  cancelRequest(reqId: number) {
    this.manageBookService.cancelRequest(reqId).subscribe({
      next: (res: Boolean) => {
        //alert('Book request rejected');
        //console.log(res);
        this.toast.success({detail: "Success Message", summary: "Request Id: "+reqId+" cancelled", duration: 5000})
        this.getAllRequests();
        // this.getLast10BookRequests()
      },
      error: (err: any) => {
        this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
        console.log(err);
      },
    });
  }

  acceptRequest(reqId: number) {
    this.manageBookService.acceptRequest(reqId).subscribe({
      next: (res: Boolean) => {
        //console.log(res);
        //alert('Book request accepted');
        this.toast.success({detail: "Success Message", summary: "Request Id: "+reqId+" accepted", duration: 5000})
        this.getAllRequests();
        // this.getLast10BookRequests()
      },
      error: (err: any) => {
        this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
        console.log(err);
      },
    });
  }

  applyFilter() {
    this.pageNumber = 0;
    this.totalPagesArray = [];
    switch (this.selectedFilter) {
      case 'PENDING':
      case 'ACCEPTED':
      case 'REJECTED':
        this.filterBy = this.selectedFilter;
        break;
      default:
        this.filterBy = null;
        break;
    }

    //this.getAllRequests();
  }
  applyFilterSearch() {
    //this.pageNumber = 0;
    this.totalPagesArray = [];
    switch (this.selectedFilter) {
      case 'PENDING':
      case 'ACCEPTED':
      case 'REJECTED':
        this.filterBy = this.selectedFilter;
        break;
      default:
        this.filterBy = null;
        break;
    }

    //this.getAllRequests();
  }
  applyFilterOnChange() {
    this.pageNumber = 0;
    this.totalPagesArray = [];
    switch (this.selectedFilter) {
      case 'PENDING':
      case 'ACCEPTED':
      case 'REJECTED':
        this.filterBy = this.selectedFilter;
        break;
      default:
        this.filterBy = null;
        break;
    }

    this.rerenderWithFilter();
  }

  searchHelper() {
    if(this.searchTerm == '') {
      //return
      this.applyFilter();
      this.getAllRequests()
    }
    this.applyFilter();
    console.log("Inside searchHelper: ",this.totalPagesArray);
    this.search();
  }

  search() {
    //this.applyFilter();
    this.username = this.searchTerm;
    console.log(this.filterBy);
    this.manageBookService
      .searchRequestsByUsername(
        this.pageNumber,
        this.pageSize,
        this.sortBy,
        this.sortDir,
        this.username,
        this.filterBy
      )
      .subscribe({
        next: (res: any) => {
          this.bookReqs = res.content;
          this.totalPages = res.totalPages;
          console.log(this.bookReqs);
          console.log(this.totalPages);

          for (let i = 1; i <= this.totalPages; i++) {
            this.totalPagesArray[i - 1] = i;
          }
          console.log("Inside search: ",this.totalPagesArray);
          //this.rerenderWithFilter()
        },
        error: (err: any) => {
          this.bookReqs = ''
          //this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
          //console.log(err);
        },
      });
  }

  rerenderWithFilter() {
    if (this.username == '') {
      //this.applyFilter();
      this.getAllRequests();
    } else {
      this.applyFilterSearch();
      this.search();
    }
  }


}
