import {Component, OnInit} from '@angular/core';
import OrderView from '../model/order/order-view';
import {ModelService} from '../model/model.service';
import {Router} from '@angular/router';
import {Pallet} from '../model/pallet/pallet';

@Component({
  selector: 'app-pick',
  templateUrl: './pick.component.html',
  styleUrls: ['./pick.component.scss']
})
export class PickComponent implements OnInit {

  orderView: OrderView;

  constructor(
    private readonly model: ModelService,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.orderView = new OrderView(this.model.orderService.currentOrder, this.model);
  }

  pickFromPallet(pallet: Pallet) {
    const order = this.orderView.order;
    this.model.orderService.orderData(
      order.id,
      order.productId,
      order.userId,
      order.buyerName,
      order.buyerAddress,
      'pickedInWarehouseFrontend',
      pallet.id,
      this.model.dateService.getDate()
    );
    this.model.orderService.currentOrder = null;
    this.model.warehouseChannel
      .synchronize()
      .then(_ => this.router.navigateByUrl('picklist'));
  }
}
