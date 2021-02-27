import {Component, OnInit} from '@angular/core';
import {ModelService} from '../model/model.service';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {

  orders: Array<OrderView>;

  constructor(
    private readonly model: ModelService
  ) {
  }

  ngOnInit() {
    this.model.shopChannel
      .synchronize()
      .then(_ => this.orders = this.model.orderService.orders.map(order =>
        new OrderView(this.model.productService.getOrCreateProduct(order.productId).name, order.state)
      ));
  }
}

class OrderView {
  constructor(
    readonly name: string,
    readonly state: string
  ) {
  }
}
