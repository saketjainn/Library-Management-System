import {Component, OnInit} from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import {ConfirmationModalService} from "../confirmation-modal/confirmation-modal.service";
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{

  role: string | null = null;
  userName: string | null = null;

  constructor(
    private storageService : StorageService,
    private auth: AuthService,
    private modalService: NgbModal,
    private confirmationDialogService: ConfirmationModalService,
    private loader: NgxUiLoaderService
    ) {

    }
  ngOnInit(): void {
    this.fetchUsername();
  }

  fetchUsername(): void{
    this.role= this.storageService.getRole();
    this.userName= this.storageService.getUsername();
    console.log("username :" + this.userName);
  }

  openProfile() {
    this.modalService.open(UserProfileComponent);
  }


  public openConfirmationDialog() {
    this.confirmationDialogService.confirm('', 'Do you really want to logout ?')
      .then((confirmed) => confirmed?this.logout():void(0))
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  logout() {
    console.log('logout');
    this.loader.startLoader('master')
    this.auth.logOut(this.storageService.getRefreshToken());
    this.storageService.logout();
    this.loader.stopLoader('master')
  }




}
