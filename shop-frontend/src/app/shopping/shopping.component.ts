import {Component, OnInit} from '@angular/core';
import Product from '../model/product/product';
import {ModelService} from '../model/model.service';
import {ProductService} from '../model/product/product.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss']
})
export class ShoppingComponent implements OnInit {

  products: Array<Product>;

  constructor(
    private readonly model: ModelService,
    private readonly productService: ProductService,
    private readonly router: Router
  ) {
  }

  ngOnInit() {
    this.model.shopChannel
      .synchronize()
      .then(_ => this.products = this.productService.products);
  }

  navigateToOrder(product: Product) {
    if (product) {
      this.productService.currentProduct = product;
      this.router.navigateByUrl('order');
    }
  }
}
