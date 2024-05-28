// auth-interceptor.ts

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { StorageService } from '../storage.service';
import {NgxUiLoaderService} from "ngx-ui-loader";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {


  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private loader: NgxUiLoaderService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if(request.url.split("8080")[1].startsWith("/auth")){
      console.log("Sending request without header");
      return next.handle(request);
    }else{
      let accessToken = this.storageService.getToken();
      if (accessToken) {
        //checking the expiry of the accesstoken and generating new access token if expire
        request = this.addToken(request, accessToken);
      }
    }
    // return next.handle(request);
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // console.log(error);



        if (error.status === 403 && !request.url.includes('/auth/')) {
          return this.handleTokenRefresh(request, next);
        }

        return throwError(error);
      })
    );

  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        ContentType: 'application/json',
        CorsHeader: 'Access-Control-Allow-Origin',
      },

    });
  }
  logout() {
    console.log('logout');
    this.loader.startLoader('master')
    this.authService.logOut(this.storageService.getRefreshToken());
    this.storageService.logout();
    this.loader.stopLoader('master')
  }

  private handleTokenRefresh(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const refreshToken = this.storageService.getRefreshToken();
    console.log(refreshToken);
    return this.authService.refreshToken(refreshToken!).pipe(
      switchMap((response: any) => {
        console.log("Inside Switchmap")
        const newAccessToken = response.token;
        console.log(response.token)

        this.storageService.saveToken(newAccessToken);


        request = this.addToken(request, newAccessToken);
        return next.handle(request);
      }),
      catchError((error) => {
        this.logout();
        return throwError(error);
      })
    );
  }
}


// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   accessToken!: String | null;
//   clonedRequest!: any;

//   constructor(
//     private authService: AuthService,
//     private storageService: StorageService
//   ) {}

//   intercept(
//     request: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> | any {
//     this.accessToken = this.storageService.getToken();
//     if (this.accessToken) {
//       console.log('INSIDE INTERCEPTOR');
//       console.log(this.accessToken);
//       this.clonedRequest = request.clone({
//         setHeaders: {
//           Authorization: `Bearer ${this.accessToken}`,
//           ContentType: 'application/json',
//           CorsHeader: 'Access-Control-Allow-Origin',
//         },
//         // withCredentials: true,
//       });
//       return next.handle(this.clonedRequest);
//     }
//     return next.handle(request);
//   }
// }

// return next.handle(this.clonedRequest).pipe(
//   catchError((error: any) => {
//     // console.log(error);
//     if (error.status === 401 || (error.status === 0 && !request.url.includes('/auth/'))) {
//       return this.authService.refreshToken().pipe(
//         switchMap((res: any) => {
//           this.storageService.saveToken(res.token);
//           this.accessToken = res.token;
//           this.clonedRequest = request.clone({
//             setHeaders: {
//               Authorization: `Bearer ${this.accessToken}`,
//             },
//             withCredentials: true,
//           });
//           return next.handle(this.clonedRequest);
//         })
//       );
//     } else if (error.status === 200) {
//       return 'Successful';
//     } else {
//       return 'Some error occured internally';
//     }
//   })
// );
