import ProductEvent from './product-event';
import Product from './product';
import {EventService} from '../../event/event.service';
import Event, {EventType} from '../../event/event';
import {Injectable} from '@angular/core';
import {saveToLocalStorage} from '../../utils';
import {DateService} from '../date.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService implements EventService<ProductEvent> {
  currentProduct: Product = null;
  private readonly productMap: Map<string, Product> = new Map<string, Product>();

  constructor(
    private readonly dateService: DateService
  ) {
  }

  get products(): Array<Product> {
    return [...this.productMap.values()];
  }

  accepts(event: Event): boolean {
    return event.eventType === EventType.PRODUCT_DATA;
  }

  apply(event: ProductEvent, save: boolean) {
    this.productData(
      event.productId,
      event.productName,
      event.productAmount,
      event.productLastModified,
      save
    );
  }

  productData(
    id: string,
    name: string,
    amount: number,
    timestamp: string,
    save: boolean
  ) {
    const product = this.loadProduct(id, name, amount, timestamp);
    if (save) {
      const event = ProductEvent.productDataEvent(product, this.dateService.getDate());
      saveToLocalStorage(event);
    }
    return product;
  }

  reset() {
    this.currentProduct = null;
  }

  getOrCreateProduct(id: string) {
    if (this.productMap.has(id)) {
      return this.productMap.get(id);
    }
    const newProduct = new Product();
    newProduct.id = id;
    this.productMap.set(id, newProduct);
    return newProduct;
  }

  private loadProduct(
    id: string,
    name: string,
    amount: number,
    timestamp: string
  ) {
    const product = this.getOrCreateProduct(id);
    if (product.id === id && product.amount === amount) {
      return product;
    }
    product.name = name;
    product.amount = amount;
    product.lastModified = timestamp;
    return product;
  }
}
