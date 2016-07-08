import { provideRouter, RouterConfig } from '@angular/router';
import { LoginComponent } from './login';
import { DashboardComponent } from './dashboard';

// import { AppComponent } from './';

const appRoutes: RouterConfig = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'login',
        component: LoginComponent
    }
];

export const APP_ROUTER_PROVIDERS = provideRouter(appRoutes);
