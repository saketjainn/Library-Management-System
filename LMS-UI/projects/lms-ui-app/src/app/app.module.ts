import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { RouterModule } from '@angular/router';
import { RegistrationPageComponent } from './component/registration-page/registration-page.component';
import { HomeComponent } from './component/home/home.component';
import { HeaderComponent } from './component/header/header.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { LoginCardComponent } from './component/login-card/login-card.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddBookComponent } from './component/sidebar/admin-sidebar/add-book/add-book.component';

import { RequestBookComponent } from './component/sidebar/user-sidebar/request-book/request-book.component';
import { UserHomeComponent } from './component/user/user-home.component';
import { AuthInterceptor } from './services/interceptors/auth.interceptor';
import { ManageBooksComponent } from './component/sidebar/admin-sidebar/manage-books/manage-books.component';

import { UserSidebarComponent } from './component/user/user-sidebar/user-sidebar.component';

import { ViewFinesComponent } from './component/sidebar/user-sidebar/view-fines/view-fines.component';
import { ViewBorrowedBooksComponent } from './component/sidebar/user-sidebar/view-borrowed-books/view-borrowed-books.component';
import { ManageRequestUserComponent } from './component/sidebar/user-sidebar/manage-request-user/manage-request-user.component';
import { ManageRequestsComponent } from './component/sidebar/admin-sidebar/manage-requests/manage-requests.component';
import { ViewMyRequestsComponent } from './component/sidebar/user-sidebar/view-my-requests/view-my-requests.component';
import { ViewUserComponent } from './component/sidebar/admin-sidebar/view-user/view-user.component';
import { LogoutComponent } from './component/header/logout/logout.component';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { ViewBorrowedBooksModalComponent } from './component/sidebar/admin-sidebar/view-user/view-borrowed-books-modal/view-borrowed-books-modal.component';
import { ViewFineModalComponent } from './component/sidebar/admin-sidebar/view-user/view-fine-modal/view-fine-modal.component';
import { AdminDashboardComponent } from './component/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './component/user-dashboard/user-dashboard.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { NewArrivalsComponent } from './component/user-dashboard/new-arrivals/new-arrivals.component';
import { NgToastModule } from 'ng-angular-popup';
import { ErrorPageComponent } from '@shared-lib/src/component/error-page/error-page.component';
import { RemoveUnderscorePipe } from '@shared-lib/src/pipes/remove-underscore.pipe';
import {ConfirmationModalComponent} from "./component/confirmation-modal/confirmation-modal.component";
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';





@NgModule({
  declarations: [
    AppComponent,
    RegistrationPageComponent,
    HomeComponent,
    HeaderComponent,
    SidebarComponent,
    LoginCardComponent,
    AddBookComponent,
    ManageBooksComponent,
    RequestBookComponent,
    UserHomeComponent,
    UserSidebarComponent,
    ViewFinesComponent,
    ViewBorrowedBooksComponent,
    ManageRequestUserComponent,
    ManageRequestsComponent,
    ViewMyRequestsComponent,
    ViewUserComponent,
    LogoutComponent,
    ViewBorrowedBooksModalComponent,
    ViewFineModalComponent,
    AdminDashboardComponent,
    UserDashboardComponent,
    UserProfileComponent,
    NewArrivalsComponent,
    ErrorPageComponent,
    RemoveUnderscorePipe,
    ConfirmationModalComponent,
    ForgotPasswordComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    NgbTooltipModule,
    // NgxUiLoaderHttpModule.forRoot({
    //   showForeground: true
    // }),

    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      disableConsoleLogging: false
    }),
    NgToastModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
