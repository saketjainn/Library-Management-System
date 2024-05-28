import {Component, OnInit} from '@angular/core';
import {Form, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {SearchBookService} from "../../services/user-service/search-book.service";
import {NgToastService} from "ng-angular-popup";
import {AuthService} from "../../services/auth.service";
import {StorageService} from "../../services/storage.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  constructor(private formBuilder: FormBuilder,
              private forgetpasswordservice: AuthService,
              private toast: NgToastService,
              private storageService: StorageService,
              private router: Router,
  ) {
  }

  formType: string = 'email'; //default email
  emailForm!: FormGroup;
  otpForm!: FormGroup;
  passwordForm!: FormGroup;
  isOtpVerified: boolean = false;
  newPassword: string = '';
  confirmPassword: string = '';
  arePasswordsSame: boolean = false;
  email: string = '';

  ngOnInit(): void {
    this.emailForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
    });
    this.otpForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
    });

  }


  generateOTP() {
    const email1 = this.emailForm.get('email');
    const email2 = email1?.value;
    console.log(email2)
    this.forgetpasswordservice.forgetPassword(email2.toString()).subscribe(
      {
        next: (response: string) => {
          this.storageService.saveEmail(email2);
          this.toast.success({detail: 'Success', summary: response, duration: 5000});
          this.switchFormType()
        },
        error: (error) => {
          this.toast.error({detail: 'Error', summary: JSON.parse(error.error).message, duration: 5000});
        }

      });


    //in next: this.switchFormType()
  }

  checkSamePassowrd() {
    this.arePasswordsSame = this.newPassword === this.confirmPassword;
  }

  switchFormType() {
    this.formType = 'otp';
  }

  verifyOTP() {
   const otp =this.otpForm.get('otp');
   console.log(otp);
   const email = this.storageService.getEmail() || '';
    this.forgetpasswordservice.verifyOtp(otp?.value, email).subscribe({
      next: (response: string) => {

        this.toast.success({detail: 'Success', summary: "OTP verified", duration: 5000});
        console.log(response);
        this.storageService.saveFPtoken(response);
        this.isOtpVerified = true;
      },
      error: (error) => {
        this.toast.error({detail: 'Error', summary: JSON.parse(error.error).message, duration: 5000});
      }
    });
    }

    resetPassword() {
      const token = this.storageService.getFPtoken() || '';
      console.log(token);
      this.forgetpasswordservice.resetPassword(this.newPassword, token).subscribe({
        next: (response: string) => {
          this.toast.success({detail: 'Success', summary: response, duration: 5000});

          this.storageService.getEmail();
          this.isOtpVerified = false;
          this.formType = 'email';

          this.router.navigate(['/']);
        },
        error: (error) => {
          this.toast.error({detail: 'Error', summary: JSON.parse(error.error).message, duration: 5000});
        }
      });
    }


}
