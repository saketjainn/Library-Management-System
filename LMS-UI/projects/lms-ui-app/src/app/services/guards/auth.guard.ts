import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { StorageService } from '../storage.service';


export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  if(storageService.isLoggedIn() && storageService.getRole() == 'ADMIN'){
    return true;
  }
  else{
    router.navigate(['/register']);
    return false;
  }
}


