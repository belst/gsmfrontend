import { provideRouter, RouterConfig } from '@angular/router';
import { LoginComponent } from './login';
import { DashboardComponent } from './dashboard';
import { AuthGuard, GsmapiService } from './shared';

const appRoutes: RouterConfig = [
    {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    }
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(appRoutes),
    [AuthGuard, GsmapiService]
];
