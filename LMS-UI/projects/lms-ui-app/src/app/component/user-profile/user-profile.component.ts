import { Component, OnInit } from '@angular/core';
import { SearchBookService } from '../../services/user-service/search-book.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import {HttpResponse} from "@angular/common/http";
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  ProfileForm!: FormGroup;
  Name: string = '';
  MobileNo: string = '';
  Address: string = '';

  constructor(
    private UserProfile: SearchBookService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.getProfile();
    this.ProfileForm = this.formBuilder.group({
      name: [''],
      mobileNo: [''],
      address: ['']
    }, { validators: this.customFormValidator.bind(this) });
  }

  validateName(control: AbstractControl): { [key: string]: boolean } | null {
    const enteredName = control.value;
    if (enteredName === this.Name) {
      return { 'sameName': true };
    }
    return null;
  }

  validateMobile(control: AbstractControl): { [key: string]: boolean } | null {
    const enteredMobile = control.value;
    if (enteredMobile === this.MobileNo) {
      return { 'sameMobile': true };
    }
    return null;
  }

  validateAddress(control: AbstractControl): { [key: string]: boolean } | null {
    const enteredAddress = control.value;
    if (enteredAddress === this.Address) {
      return { 'sameAddress': true };
    }
    return null;
  }

  getProfile() {
    this.UserProfile.getUserProfile().subscribe({
      next: (res: any) => {
        this.Name = res.name;
        this.MobileNo = res.mobileNo;
        this.Address = res.address;
        this.ProfileForm.controls['name'].setValue(res.name);
        this.ProfileForm.controls['mobileNo'].setValue(res.mobileNo);
        this.ProfileForm.controls['address'].setValue(res.address);
        console.log(res);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  customFormValidator(control: FormGroup): ValidationErrors | null {
    const nameControl = control.get('name');
    const mobileControl = control.get('mobileNo');
    const addressControl = control.get('address');

    const name = nameControl?.value as string;
    const mobileNo = mobileControl?.value as string;
    const address = addressControl?.value as string;

    if (name === this.Name && mobileNo === this.MobileNo && address === this.Address) {
      return { 'formInvalid': true };
    }
    else {
      return null;}
  }

  onUpdate(): void {
    console.log("onUpdateCalled");
    console.log(this.ProfileForm.value);
    if (this.ProfileForm.valid) {
      this.UserProfile.updateUser(this.ProfileForm.value).subscribe({
        next: (response:HttpResponse<any>) => {
          console.log('Response from server:', response);
          this.ProfileForm.reset();
          //alert("Book Added Successfully!");
          this.toast.success({detail: "Success Message", summary: "Profile Updated Sucessfully", duration: 5000})
          this.getProfile();
        },

        error: (error : any) => {
          console.log(error);
          this.toast.error({detail: "Error Message", summary: error.error.message, duration: 5000})

          //alert(error.error.message);
        }
      });
    } else {
      // Form is invalid, handle accordingly
    }
  }
}
