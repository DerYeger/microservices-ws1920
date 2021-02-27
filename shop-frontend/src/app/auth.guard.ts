import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs/internal/Observable';
import {ModelService} from './model/model.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly model: ModelService
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const path = next.routeConfig.path;
    if (this.model.userService.currentUser) { // User is logged in
      return this.canActivateWithLogin(path);
    } else { // User is not logged in
      return this.canActivateWithoutLogin(path);
    }
  }

  private canActivateWithLogin(path: string): boolean | UrlTree {
    if (['shopping', 'delivery'].includes(path)) {
      return true;
    } else if (path === 'order' && this.model.productService.currentProduct) {
      return true;
    } else {
      return this.router.parseUrl('shopping');
    }
  }

  private canActivateWithoutLogin(path: string): boolean | UrlTree {
    if (['login'].includes(path)) {
      return true;
    } else {
      return this.router.parseUrl('login');
    }
  }
}
