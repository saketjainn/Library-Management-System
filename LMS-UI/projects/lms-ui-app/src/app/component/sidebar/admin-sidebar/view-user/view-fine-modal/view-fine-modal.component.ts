import { Component, Input, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { Fine } from 'projects/lms-ui-app/src/app/interfaces/fine';
import { FinePagination } from 'projects/lms-ui-app/src/app/interfaces/finePagination';
import { User } from 'projects/lms-ui-app/src/app/interfaces/user';
import { AddBookService } from 'projects/lms-ui-app/src/app/services/admin-services/add-book.service';
import { SearchBookService } from 'projects/lms-ui-app/src/app/services/user-service/search-book.service';

@Component({
  selector: 'app-view-fine-modal',
  templateUrl: './view-fine-modal.component.html',
  styleUrls: ['./view-fine-modal.component.scss']
})
export class ViewFineModalComponent implements OnInit{

  @Input() user: User | any;
  username: string = '';

  fine: Fine | any
  fines : Fine[] | any;
  pageNumber = 0;
  totalPagesArray: number[] = [];
  pageSize = 10;
  totalPages = 0;
  sortBy = 'name';
  sortDir = 'asc';

  constructor(private fetchFine: AddBookService, private toast: NgToastService) {}



    ngOnInit(): void {
      this.username = this.user.username;
      this.fetchFines()
    }

    fetchFines() {
      console.log('Inside fetchFines()');
      this.fetchFine.getfines(this.pageNumber,this.username).subscribe({
        next: (res : FinePagination) => {
          this.fines = res.content
          console.log(this.fines)
          this.totalPages = res.totalPages;
          for (let i = 1; i <= this.totalPages ; i++) {
            this.totalPagesArray[i - 1] = i;
          }

        },
        error : (err: any) => {
          //this.toast.error({detail: "Fine error Message", summary: err.error.message, duration: 5000})
          //console.log(err)
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
