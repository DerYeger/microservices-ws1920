import {Component, OnInit} from '@angular/core';
import {ModelService} from './model/model.service';
import {UserService} from './model/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    readonly model: ModelService,
    readonly userService: UserService
  ) {
  }

  ngOnInit() {
    this.model.loadEvents();
    this.model.initChannels();
  }
}
