import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from 'projects/lms-ui-app/src/app/interfaces/book';
import { AddBookService } from 'projects/lms-ui-app/src/app/services/admin-services/add-book.service';
// import { AuthService } from 'projects/lms-ui-app/src/app/services/auth.service';
import { Genre } from '../../../../interfaces/Genre';
import { NgToastService } from 'ng-angular-popup';
import { Publisher } from 'projects/lms-ui-app/src/app/interfaces/publisher';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent implements OnInit {
  genres: Genre[] | undefined;
  bookForm!: FormGroup;
  currentYear: number = new Date().getFullYear();
  publishers: Publisher[] = []

  constructor(
    private formBuilder: FormBuilder,
    private bookService: AddBookService,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getPublishers()
    this.genres = Object.values(Genre);

  }



  initForm(): void {
    console.log(this.currentYear);

    this.bookForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.pattern(/^.{3,50}$/)]],
      author: ['', [Validators.required, Validators.pattern(/^.{3,50}$/)]],
      isbn: ['', [Validators.required, Validators.pattern(/^\d{10}(\d{3})?$/)]],
      printYear: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?:[1-9]\d{3})$/),
          Validators.max(this.currentYear),
          Validators.min(1400)
        ],
       
      ],
      genre: ['', Validators.required],
      quantityAvailable: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[1-9]\d*$/),
          Validators.max(100),
        ],
      ],
      isActive: [true],
      publisherId: [
        '',
        [Validators.required],
      ],
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      console.log(this.bookForm.value);

      this.bookService.addBook(this.bookForm.value).subscribe({
        next: (response:HttpResponse<any>) => {
          console.log('Response from server:', response);
          this.bookForm.reset();
          //alert("Book Added Successfully!");
          this.toast.success({
            detail: 'Success Message',
            summary: 'Book Added Successful',
            duration: 5000,
          });
        },

        error: (error: any) => {
          console.log(error);
          this.toast.error({
            detail: 'Error Message',
            summary: error.error.message,
            duration: 5000,
          });

          //alert(error.error.message);
        },
      });
    } else {
      // Form is invalid, handle accordingly
    }
  }

  getPublishers() {
    this.bookService.getPublishers().subscribe({
      next: (pub: any) => {
        this.publishers = pub
        console.log(this.publishers);
        
      },
      error: (err: any) => {

      }
     })
  }

  resetForm() {
    this.bookForm.reset();
  }
}


