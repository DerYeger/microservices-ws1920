import {Component, OnInit} from '@angular/core';
import {ModelService} from '../model/model.service';
import {Router} from '@angular/router';
import OrderView from '../model/order/order-view';

@Component({
  selector: 'app-picklist',
  templateUrl: './picklist.component.html',
  styleUrls: ['./picklist.component.scss']
})
export class PicklistComponent implements OnInit {

  orderViews: Array<OrderView>;

  constructor(
    private readonly model: ModelService,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.model.warehouseChannel
      .synchronize()
      .then(_ =>
        this.orderViews = this.model.orderService
          .orders
          .filter(order => order.state === 'newInWarehouseBackend')
          .map(order => new OrderView(order, this.model))
      );
  }

  navigateToPick(orderView: OrderView) {
    this.model.orderService.currentOrder = orderView.order;
    this.router.navigateByUrl('pick');
  }
}
