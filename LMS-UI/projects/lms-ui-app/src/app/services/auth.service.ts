import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RegisterUser} from '../interfaces/register-user';
import {LoginUser} from '../interfaces/login-user';
import {Book} from '../interfaces/book';
import {environment} from '@environments/env';
import {AuthenticationResponse} from '../interfaces/authentication-response';
//import { RefreshTokenRequest } from '../interfaces/refresh-token-request';
//import { AuthenticationResponse } from '../interfaces/authenticationToken';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  env = environment;

  constructor(private http: HttpClient) {
  }

  register(data: RegisterUser) {
    console.log("Inside register service, " + data)
    return this.http.post(
      `${this.env.serverUrl}${this.env.authPrefix}/register`,
      data
    );
  }

  logIn(data: LoginUser) {
    console.log(data);
    return this.http.post(
      `${this.env.serverUrl}${this.env.authPrefix}/login`,
      data
    );
  }

  // refreshToken(refreshToken: string):Observable<AuthenticationResponse> {
  //   const request: RefreshTokenRequest = { refreshToken };
  //   console.log("Refresh Token : ", refreshToken);
  //    return this.http.post<AuthenticationResponse>(`${this.env.serverUrl}${this.env.authPrefix}/refreshToken`, request);
  // }

  refreshToken(refreshToken: any) {
    console.log('Refresh Token : ', refreshToken);
    return this.http.post(
      `${this.env.serverUrl}${this.env.authPrefix}/refreshToken`,
      {
        'refreshToken': refreshToken,
      }
    );
  }

  isTokenExpired(): boolean {
    return true;
  }


  checkUsernameAvailability(username: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.env.serverUrl}${this.env.userUrlPrefix}/is-username-available?username=${username}`
    );
  }

  logOut(refreshToken: any) {

    return this.http.post(
      `${this.env.serverUrl}${this.env.authPrefix}/refreshToken`,
      {
        'refreshToken': refreshToken,
      }
    );
  }


  forgetPassword(email: string) {
    console.log("Inside forgetPassword service, " + email)
    const url = `${this.env.serverUrl}${this.env.authPrefix}/forgotPassword`;
    return this.http.get<any>(url, {
      params:{email},
      responseType: 'text' as 'json'
    });
  }

  verifyOtp(otp: string, email: string) {
    const url = `${this.env.serverUrl}${this.env.authPrefix}/verify-otp`;
    return this.http.get<any>(url, {
      params:{otp, email},
      responseType: 'text' as 'json'
    });
  }

  resetPassword(password: string, token: string) {
    const url = `${this.env.serverUrl}${this.env.authPrefix}/reset-password`;
    console.log(password, token);

    return this.http.get<any>(url, {
      params:{password, token},
      responseType: 'text' as 'json'
    });
  }
}
