import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';


@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.scss'],
})
export class LoginCardComponent implements OnInit {
  formType: string= 'login';
  userForm!: FormGroup;
  userFormLogin!: FormGroup
  message: string = '';
  isUsernameTaken: boolean = false;
  responseToken!: string;

  constructor(
    private formBuilder: FormBuilder,
    private userService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
      address: ['', Validators.required],
      mobileNo: ['', Validators.required  ],
    });
    this.userFormLogin = this.formBuilder.group({
      username: ['abc', Validators.required],
      password: ['1234', Validators.required]
    })
  }

  switchForm(type: string): void {
    this.formType = type;
  }

  onSignup(): void {
    this.checkUsernameAvailability();

    if (!this.isUsernameTaken) {
      if (this.formType === 'signup') {
        if (this.userForm.valid) {
          this.userService.register(this.userForm.value).subscribe(
            (res: any) => {
              this.storageService.saveToken(res.token);
              this.storageService.saveRefreshToken(res.refreshToken);
              console.log(localStorage.getItem('access-token'))
              console.log(localStorage.getItem('refresh-token'))
              console.log('User registered successfully:', res);
              console.log(this.userForm.value)
              this.userForm.reset();
              this.storageService.saveRole('USER')
            
              this.storageService.saveUsername(this.userForm.value.username)
              this.router.navigate(['/user-home'])
              
            },
            (error) => {
              console.error('Error registering user:', error);
            }
          );
        } else {
          console.log('Form is not valid');
        }
      } else if (this.formType === 'login') {
        // Handle login form submission if needed
        // this.onLogin();
      }
    } else {
      this.userForm.reset();
    }
  }

  onLogin(): void {
    this.userService.logIn(this.userFormLogin.value).subscribe((res: any) => {
      this.storageService.saveToken(res.authenticationResponse.token);
      this.storageService.saveRefreshToken(res.authenticationResponse.refreshToken);
      console.log(localStorage.getItem('access-token'))
      console.log(localStorage.getItem('refresh-token'))
      this.storageService.saveUsername(this.userFormLogin.value.username)
      this.storageService.saveRole(res.role);
    
   
      // this.router.navigate(['/home']);
      console.log(res.role)
      console.log(this.storageService.isLoggedIn())
      if(res.role != 'USER') {
        console.log('if block Admin')
        this.router.navigate(['/home']);
        
        
        
      }else {
        console.log('if block user')
        this.router.navigate(['/user-home'])
       
      }
    });
  }

  checkUsernameAvailability(): void {
    if (this.userForm) {
      const usernameControl = this.userForm.get('username');

      if (usernameControl) {
        const username = usernameControl.value;

        this.userService.checkUsernameAvailability(username).subscribe(
          (result) => {
            this.isUsernameTaken = result;
            this.message = result
              ? 'Username is available'
              : 'Username is already taken'
                this.userForm.reset()
              ;
          },
          (error) => {
            console.error('Error checking username availability:', error);
          }
        );
      } else {
        console.error("'username' control not found in the userForm.");
      }
    } else {
      console.error('userForm is null or undefined.');
    }
  }

  logout() : void {
    localStorage.clear()

  }
}






