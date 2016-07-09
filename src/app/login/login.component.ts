import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_PROGRESS_BAR_DIRECTIVES } from '@angular2-material/progress-bar';

import { GsmapiService, Creds } from '../shared';

// Added by MDL
declare var componentHandler: any;

@Component({
  moduleId: module.id,
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  directives: [
    MD_CARD_DIRECTIVES,
    MD_INPUT_DIRECTIVES,
    MD_BUTTON_DIRECTIVES,
    MD_PROGRESS_BAR_DIRECTIVES
  ]
})
export class LoginComponent implements OnInit, AfterViewInit, CanActivate {

  private credentials: Creds = {
    username: null,
    password: null,
    token: null
  };
  private host: string;
  private port: number;
  private loading = false;

  constructor(
    private api: GsmapiService,
    private router: Router) {}

  ngOnInit() {
    if (this.api.loggedin) {
      this.router.navigate(['']);
    }
  }

  canActivate() {
    console.log('check for activation');
    return !this.api.loggedin;
  }

  ngAfterViewInit() {
    componentHandler.upgradeAllRegistered();
  }

  public onSubmit() {
    console.log('submitted');
    this.loading = true;
    componentHandler.upgradeAllRegistered();
    try {
      setTimeout(_ => {
        this.loading = false;
        this.api.loggedin = true;
        this.router.navigate(['']);
      }
      , 10000);
      // this.api.login(`ws://${this.host}:${this.port}`, this.credentials)
      // .then(data => {
      //   this.loading = false;
      //   this.router.navigate(['']);
      // },
      // err => {
      //   console.error(err);
      // });
    } catch (e) {
      console.error(e);
    }
  }
}
