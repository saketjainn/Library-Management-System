import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss'],
})
export class RegistrationPageComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private regService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private toast: NgToastService,
    private loader: NgxUiLoaderService
  ) {}
  signUpForm!: FormGroup;
  loginForm!: FormGroup;
  formType: string = 'login';
  message = '';
  isUernameAvailable: boolean = false;

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z][a-zA-Z0-9_]{2,9}$/),
        ],
      ],
      name: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z. ]{3,30}$/)],
      ],
      password: ['', [Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|<>?]).{8,20}$/), Validators.required]],
      address: ['', [Validators.required, Validators.pattern(/^.{3,50}$/)]],
      mobileNo: ['', [Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]
    });
    this.loginForm = this.formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z][a-zA-Z0-9_]{2,9}$/),
        ],
      ],

      password: ['', [Validators.required, Validators.pattern(/^.{8,20}$/)]],
    });
  }

  // checkUsername() {
  //   const usernameControl = this.signUpForm.get('username');
  //   const username = usernameControl?.value;
  //   this.regService.checkUsernameAvailability(username).subscribe({
  //     next: (res: boolean) => {
  //       this.isUernameAvailable = res;
  //       if (res) {
  //         this.message = 'Username avaialable';
  //         this.toast.success({detail: "Success Message", summary: this.message, duration: 5000})
  //       } else {
  //         this.message = 'Username already taken';
  //         this.toast.error({detail: "Error Message", summary: this.message, duration: 5000})
  //       }
  //       //console.log(this.message);
  //     },
  //     error: (err: any) => {
  //       this.toast.error({detail: "Error Message", summary: err.error.message, duration: 5000})
  //       console.log(err);
  //     },
  //   });
  // }
  onSignUp() {
    this.loader.startLoader('master');
    this.regService.register(this.signUpForm.value).subscribe({
      next: (res: any) => {
        this.storageService.saveToken(res.token);
        this.storageService.saveRefreshToken(res.refreshToken);
        console.log(localStorage.getItem('access-token'));
        console.log(localStorage.getItem('refresh-token'));
        console.log('User registered successfully:', res);
        console.log(this.signUpForm.value);
        this.storageService.saveUsername(this.signUpForm.value.username);
        this.signUpForm.reset();
        this.storageService.saveRole('USER');
        this.router.navigate(['/user-home/app-user-dashboard']);
        this.toast.success({
          detail: 'Success Message',
          summary: 'New User Registration Successful',
          duration: 5000,
        });
        this.formType = 'login';
        this.loader.stopAllLoader('master');
        //this.signUpForm.reset();
      },
      error: (err: any) => {
        this.toast.error({
          detail: 'Error Message',
          summary: err.error.message,
          duration: 5000,
        });
        console.log(err);
        this.loader.stopAllLoader('master');
      },
    });
  }

  onLogin() {
    this.loader.startLoader('master');
    this.regService.logIn(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.storageService.saveToken(res.authenticationResponse.token);
        this.storageService.saveRefreshToken(
          res.authenticationResponse.refreshToken
        );
        console.log(localStorage.getItem('access-token'));
        console.log(localStorage.getItem('refresh-token'));

        this.storageService.saveRole(res.role);
        console.log(localStorage.getItem('userRole'));
        this.storageService.saveUsername(this.loginForm.value.username);
        if (res.role != 'USER') {
          this.router.navigate(['/home/app-admin-dashboard']);

        } else {
          this.router.navigate(['/user-home/app-user-dashboard']);
          // this.loader.stop('master')
        }
        this.toast.success({
          detail: 'Success Message',
          summary: 'Log in Successful',
          duration: 5000,
        });
        this.loader.stopLoader('master');
      },
      error: (err: any) => {
        console.log(err.error.message);
        this.toast.error({
          detail: 'Error Message',
          summary: err.error.message,
          duration: 5000,
        });
        this.loader.stopLoader('master');
      },
    });
  }

  goToForgotPassword() {
    this.router.navigate(['forgot-password'])
  }

  switchForm(type: string): void {
    this.formType = type;
  }
}
