import { Injectable }          from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GsmapiService }       from './';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private api: GsmapiService, private router: Router) {}

  canActivate() {
    if (this.api.loggedin) {
        return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
