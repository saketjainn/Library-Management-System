import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// const ACCESS_TOKEN = 'access_token';
// const userRole = ''

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  saveUsername(username: string): void {
    console.log(username);
    localStorage.setItem('userName', username);
  }


  constructor(private router: Router) { }

  getRefreshToken():string | null {
    return localStorage.getItem('refresh-token')
  }

  getUsername(): string | null {
    return localStorage.getItem('userName');
  }


  saveRefreshToken(refreshtoken: string) {
    localStorage.removeItem('refresh-token')
    localStorage.setItem('refresh-token', refreshtoken);
  }

  saveEmail(email: string): void {
    localStorage.removeItem('email');
    localStorage.setItem('email', email);

  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }
  saveFPtoken(ForgetPasswordToken: string): void {
    localStorage.removeItem('ForgetPasswordToken');
    localStorage.setItem('ForgetPasswordToken', ForgetPasswordToken);

  }

  getFPtoken(): string | null {
    return localStorage.getItem('ForgetPasswordToken');
  }

  saveToken(token: string): void{
    localStorage.removeItem('access-token');
    localStorage.setItem('access-token', token);
  }

  getToken(): string | null{
    return localStorage.getItem('access-token');
  }

  removeToken(): void{
    localStorage.removeItem('access-token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (token) {
      return true;
    }
    return false;
  }

  saveRole(role: string): void {
    localStorage.setItem('userRole', role);
  }




  getRole() : string | null {
    return localStorage.getItem('userRole');

  }

  logout() : void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}




