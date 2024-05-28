import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBookComponent } from './component/sidebar/admin-sidebar/add-book/add-book.component';
import { ManageBooksComponent } from './component/sidebar/admin-sidebar/manage-books/manage-books.component';
import { ManageRequestsComponent } from './component/sidebar/admin-sidebar/manage-requests/manage-requests.component';
import { ViewUserComponent } from './component/sidebar/admin-sidebar/view-user/view-user.component';
import { RegistrationPageComponent } from './component/registration-page/registration-page.component';
import { HomeComponent } from './component/home/home.component';
import { LoginCardComponent } from './component/login-card/login-card.component';
import { authGuard } from './services/guards/auth.guard';
import { UserHomeComponent } from './component/user/user-home.component';
import { userAuthGuard } from './services/guards/user-auth.guard';
import { RequestBookComponent } from './component/sidebar/user-sidebar/request-book/request-book.component';
import { ViewBorrowedBooksComponent } from './component/sidebar/user-sidebar/view-borrowed-books/view-borrowed-books.component';
import { ViewFinesComponent } from './component/sidebar/user-sidebar/view-fines/view-fines.component';
import { ManageRequestUserComponent } from './component/sidebar/user-sidebar/manage-request-user/manage-request-user.component';
import { ViewMyRequestsComponent } from './component/sidebar/user-sidebar/view-my-requests/view-my-requests.component';
import { registrationAuthGuard } from './services/guards/registration-auth.guard';
import { AdminDashboardComponent } from './component/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './component/user-dashboard/user-dashboard.component';
import { ErrorPageComponent } from '@shared-lib/src/component/error-page/error-page.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: 'authenticate',
    component: RegistrationPageComponent,
    canActivate: [registrationAuthGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [registrationAuthGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home',
    canActivate: [authGuard],
    children: [
      {
        path: 'app-admin-dashboard',
        component: AdminDashboardComponent,
        title: 'Admin Dashboard',
      },
      { path: 'add-book', title: 'Add Book', component: AddBookComponent },
      {
        path: 'manage-book',
        title: 'Manage Book',
        component: ManageBooksComponent,
      },
      {
        path: 'manage-request',
        title: 'Manage Request',
        component: ManageRequestsComponent,
      },
      { path: 'view-user', title: 'View User', component: ViewUserComponent },
    ],
  },

  {
    path: 'user-home',
    component: UserHomeComponent,
    title: 'UserHome',
    canActivate: [userAuthGuard],
    children: [
      { path: 'app-user-dashboard', component: UserDashboardComponent },
      { path: 'app-request-book', component: RequestBookComponent },
      {
        path: 'app-manage-request-user',
        component: ManageRequestUserComponent,
      },
      {
        path: 'app-view-borrowed-books',
        component: ViewBorrowedBooksComponent,
      },
      { path: 'app-view-fines', component: ViewFinesComponent },
      { path: 'app-view-my-requests', component: ViewMyRequestsComponent },
    ],
  },

  { path: '', redirectTo: '/authenticate', pathMatch: 'full' },
  { path: '**', pathMatch: 'full', component: ErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
