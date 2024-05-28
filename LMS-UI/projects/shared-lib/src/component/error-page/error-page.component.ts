import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'projects/lms-ui-app/src/app/services/storage.service';

@Component({
  selector: 'lib-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent {
  role: String| null = ''
  constructor(private stotrageService: StorageService, private router: Router) {}
 
  backHome() {
    this.role =  this.stotrageService.getRole()
    console.log(this.role);
    
    if (this.role != 'USER') {
      this.router.navigate(['/home/app-admin-dashboard']);
    } else {
      this.router.navigate(['/user-home/app-user-dashboard']);
    }
  }

}
