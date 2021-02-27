import {Component, OnInit} from '@angular/core';
import {Pallet} from '../model/pallet/pallet';
import {ModelService} from '../model/model.service';
import {Router} from '@angular/router';
import {noneAreUndefinedOrNullOrBlank} from '../utils';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  pallet: Pallet;
  placeIn: string;
  readonly inputIsValid = noneAreUndefinedOrNullOrBlank;

  constructor(
    private readonly model: ModelService,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.pallet = this.model.palletService.currentPallet;
    this.placeIn = this.pallet.place;
  }

  public storePalletAction() {
    this.model.palletService.palletData(
      this.pallet.id,
      this.pallet.product,
      this.pallet.amount,
      this.pallet.priority,
      this.placeIn,
      'storedInFrontend',
      this.model.userService.currentUser,
      this.model.dateService.getDate()
    );
    this.model.palletService.currentPallet = null;
    this.router.navigateByUrl('ramp');
  }
}

