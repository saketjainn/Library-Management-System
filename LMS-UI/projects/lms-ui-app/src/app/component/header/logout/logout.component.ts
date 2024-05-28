import { Component } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  constructor(
    private storageService : StorageService,
    private auth: AuthService
    ) { }

  logout() {
    this.auth.logOut(this.storageService.getRefreshToken());
    this.storageService.logout();
  }

}
