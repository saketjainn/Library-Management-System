import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'lms-ui-app';
  //dummy data for user name and role
  userName: string = 'John Doe';
  role: string = 'Admin';

  
}
