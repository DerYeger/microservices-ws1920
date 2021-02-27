import {Component, OnInit} from '@angular/core';
import {PalletService} from '../model/pallet/pallet.service';
import {Pallet} from '../model/pallet/pallet';
import {Router} from '@angular/router';
import {ModelService} from '../model/model.service';

@Component({
  selector: 'app-ramp',
  templateUrl: './ramp.component.html',
  styleUrls: ['./ramp.component.scss']
})
export class RampComponent implements OnInit {

  pallets: Array<Pallet>;

  constructor(
    private readonly model: ModelService,
    private readonly palletService: PalletService,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.model.warehouseChannel.synchronize().then(_ => this.pallets = this.palletService.pallets.filter(pallet => !pallet.place));
  }

  navigateToStore(pallet: Pallet) {
    if (pallet) {
      this.palletService.currentPallet = pallet;
      this.router.navigateByUrl('store');
    }
  }
}
