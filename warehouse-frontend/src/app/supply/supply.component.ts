import {Component, OnInit} from '@angular/core';
import {ModelService} from '../model/model.service';
import {PalletService} from '../model/pallet/pallet.service';
import {Router} from '@angular/router';
import {noneAreUndefinedOrNullOrBlank} from '../utils';
import {DateService} from '../model/date.service';

@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrls: ['./supply.component.scss']
})
export class SupplyComponent implements OnInit {
  palletIdIn: string;
  productIn: string;
  amountIn: number;
  priorityIn: string;

  readonly inputIsValid = noneAreUndefinedOrNullOrBlank;

  constructor(
    private readonly model: ModelService,
    private readonly palletService: PalletService,
    private readonly dateService: DateService,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
  }

  confirmAction() {
    this.palletService.currentPallet = this.palletService.palletData(
      this.palletIdIn,
      this.productIn,
      this.amountIn,
      this.priorityIn,
      undefined,
      'addedInFrontend',
      this.model.userService.currentUser,
      this.dateService.getDate()
    );
    this.router.navigateByUrl('ramp');
  }

  ensureAmountInIsPositive() {
    if (this.amountIn < 0) {
      this.amountIn = 0;
    }
  }
}
