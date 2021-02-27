import {Component, OnInit} from '@angular/core';
import {ModelService} from '../model/model.service';
import {Router} from '@angular/router';
import Product from '../model/product/product';
import {noneAreUndefinedOrNullOrBlank} from '../utils';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  product: Product;
  nameIn: string;
  addressIn: string;
  readonly inputIsValid = noneAreUndefinedOrNullOrBlank;

  constructor(
    private readonly model: ModelService,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.product = this.model.productService.currentProduct;
  }

  orderProduct() {
    const user = this.model.userService.currentUser;
    const date = this.model.dateService.getDate();
    const order = this.model.orderService.orderData(
      `${this.product.id}-${user.id}-${date}`,
      this.product.id,
      user.id,
      this.nameIn,
      this.addressIn,
      'newInShopFrontend',
      null,
      date
    );
    this.model.shopChannel.synchronize().then(_ => this.router.navigateByUrl('delivery'));
  }
}
