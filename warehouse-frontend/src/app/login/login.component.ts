import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../model/user/user.service';
import {noneAreUndefinedOrNullOrBlank} from '../utils';
import {ModelService} from '../model/model.service';
import {DateService} from '../model/date.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userIdIn: string;
  userNameIn: string;

  readonly inputIsValid = noneAreUndefinedOrNullOrBlank;

  constructor(
    private readonly userService: UserService,
    private readonly model: ModelService,
    private readonly dateService: DateService,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    const user = this.userService.currentUser;
    if (user) {
      this.userIdIn = user.id;
      this.userNameIn = user.name;
    }
  }

  loginAction() {
    this.userService.currentUser = this.userService.userData(
      this.userIdIn,
      this.userNameIn,
      this.dateService.getDate()
    );
    this.model.warehouseChannel.synchronize();
    this.router.navigateByUrl('supply');
  }
}
