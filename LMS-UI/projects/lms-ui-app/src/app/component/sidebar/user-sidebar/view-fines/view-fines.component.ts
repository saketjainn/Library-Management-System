import { Component, OnInit } from '@angular/core';
import { Fine } from 'projects/lms-ui-app/src/app/interfaces/fine';
import { SearchBookService } from 'projects/lms-ui-app/src/app/services/user-service/search-book.service';
import {FinePagination} from 'projects/lms-ui-app/src/app/interfaces/finePagination';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-view-fines',
  templateUrl: './view-fines.component.html',
  styleUrls: ['./view-fines.component.scss']
})
export class ViewFinesComponent implements OnInit{

fine: Fine | any
fines : Fine[] | any;
pageNumber = 0;
totalPagesArray: number[] = [];
pageSize = 10;
totalPages = 0;
sortBy = 'name';
sortDir = 'asc';

constructor(private fetchFine: SearchBookService, private toast: NgToastService) {}



  ngOnInit(): void {
    this.fetchFines()
  }

  fetchFines() {
    this.fetchFine.getfines(this.pageNumber, this.pageSize ).subscribe({
      next: (res : FinePagination) => {
        this.fines = res.content
        console.log(this.fines)
        this.totalPages = res.totalPages;
        for (let i = 1; i <= this.totalPages ; i++) {
          this.totalPagesArray[i - 1] = i;
        }

      },
      error : (err: any) => {
        this.fines=''
        // this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
       // console.log(err)
      }
 
    })


  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages-1) {
      this.pageNumber++;

      this.fetchFines()
    }
  }

  prevPage(): void {
    if (this.pageNumber != 0) {
      this.pageNumber--;

      this.fetchFines()
    }
  }

  goToPage(page: number): void {
    if (page > -1 && page < this.totalPages) {
      this.pageNumber = page;

      this.fetchFines()
    }
  }

}