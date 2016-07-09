import { Component, OnInit } from '@angular/core';
import { GsmapiService } from '../shared';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  directives: [ROUTER_DIRECTIVES],
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private api: GsmapiService,
    private router: Router
  ) {}

  ngOnInit() {
    // unimplemented
  }

}
