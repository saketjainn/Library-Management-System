import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { StorageService } from '../storage.service';
export const registrationAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  ) => {
    const storageService = inject(StorageService);
  const router = inject(Router);
  if(storageService.isLoggedIn()==false){
    return true;
  }
  else{
    if(storageService.getRole() == 'USER'){
      router.navigate(['/user-home']);
    }
    else if(storageService.getRole() == 'ADMIN'){
      router.navigate(['home']);
    }
    return false;

    //error page
  }

  
};
