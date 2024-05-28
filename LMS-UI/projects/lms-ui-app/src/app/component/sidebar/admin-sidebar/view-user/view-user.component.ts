import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'projects/lms-ui-app/src/app/interfaces/user';
import { UserPagination } from 'projects/lms-ui-app/src/app/interfaces/userPagination';
import { AddBookService } from 'projects/lms-ui-app/src/app/services/admin-services/add-book.service';
import { SearchBookService } from 'projects/lms-ui-app/src/app/services/user-service/search-book.service';
import { ViewBorrowedBooksModalComponent } from 'projects/lms-ui-app/src/app/component/sidebar/admin-sidebar/view-user/view-borrowed-books-modal/view-borrowed-books-modal.component';
import { ViewFineModalComponent } from './view-fine-modal/view-fine-modal.component';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit{
  user: User | any
  users : User[] | any;
  pageNumber : number= 0;
  totalPagesArray: number[] = [];
  pageSize = 10;
  totalPages = 0;
  sortBy = 'name';
  sortDir = 'asc';
  username : string = ''
  selectedUser: User | null = null;


  constructor(private fetchUser: AddBookService, private modalService: NgbModal, private toast: NgToastService) {}

  ngOnInit(): void {
      this.fetchUsers()
  }

  fetchUsers() {
    this.fetchUser.getAllUser(this.pageNumber, this.pageSize,  ).subscribe({
      next: (res : UserPagination) => {
        this.users = res.content
        console.log(this.users)
        this.totalPages = res.totalPages;
        console.log(this.totalPages)
        for (let i = 1; i <= this.totalPages ; i++) {
          this.totalPagesArray[i - 1] = i;
        }
        console.log(this.totalPagesArray)
      },
      error : (err: any) => {
        this.users = ''
        this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
        console.log(err)
      }
    })
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages-1) {
      this.pageNumber++;
      this.fetchUsers()
    }
  }

  prevPage(): void {
    if (this.pageNumber != 0) {
      this.pageNumber--;
      this.fetchUsers()
    }
  }

  goToPage(page: number): void {
    if (page > -1 && page < this.totalPages) {
      this.pageNumber = page;
      this.fetchUsers()
    }
  }

  searchUserByUsername() {
    if(this.username == '') {
      this.fetchUsers()
    }
    this.pageNumber = 0
    this.totalPagesArray = []
    this.fetchUser.searchUserByUsername(this.pageNumber, this.username).subscribe({
      next: (res: any) => {
        this.users = res.content
        console.log(this.users)
        this.totalPages = res.totalPages;
        console.log(this.totalPages)
        for (let i = 1; i <= this.totalPages ; i++) {
          this.totalPagesArray[i - 1] = i;
        }
        console.log(this.totalPagesArray)
      },  
      error: (err) => {
        this.users = ''
       // this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
        console.log(err)
      }
    })
  }

  openFinesModal(user: User) {
    this.selectedUser = user;
    const modalRef = this.modalService.open(ViewFineModalComponent, { centered: true }); // Open centered (optional)
    modalRef.componentInstance.user = user; // Open the modal using modalService
  }


  openBorrowedBooksModal(user: User) {
    this.selectedUser = user;
    const modalRef = this.modalService.open(ViewBorrowedBooksModalComponent, { centered: true }); // Open centered (optional)
    modalRef.componentInstance.user = user; // Pass user data
  }


}


