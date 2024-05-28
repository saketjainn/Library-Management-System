import { Component, HostListener, Input, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { LogoutComponent } from './logout/logout.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  // storageService!: StorageService
  
 

  

  constructor(private storageService: StorageService) { }
  
  isLoggedIn: boolean = this.storageService.isLoggedIn();
  role: string | null = this.storageService.getRole();
  userName: string | null = this.storageService.getUsername();
  
  


  

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    // You can add logic here to handle scroll events
  }


}
