import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WINDOW } from '../window.provider';


@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {
  id: string;

  constructor(
    private route: ActivatedRoute,
    @Inject(WINDOW) private window: Window
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  getClientURL() : string {
    return this.window.location.hostname + "/client/" + this.id;
  }
}
