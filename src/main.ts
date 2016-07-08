import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent, environment, APP_ROUTER_PROVIDERS } from './app/';
import { GsmapiService } from './app/shared';

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent, [
  GsmapiService,
  APP_ROUTER_PROVIDERS
]);
