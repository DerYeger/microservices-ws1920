import {Injectable} from '@angular/core';
import {UserService} from './user/user.service';
import {EventService} from '../event/event.service';
import {AppSettings} from '../app-settings';
import {HttpClient} from '@angular/common/http';
import {DateService} from './date.service';
import {ProductService} from './product/product.service';
import Event from '../event/event';
import ShopChannel from '../channel/shop-channel';
import {OrderService} from './order/order.service';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  public shopChannel: ShopChannel;
  private readonly serviceList = new Array<EventService<Event>>(
    this.productService,
    this.userService,
    this.orderService
  );

  constructor(
    public readonly productService: ProductService,
    public readonly userService: UserService,
    public readonly orderService: OrderService,
    public readonly httpClient: HttpClient,
    public readonly dateService: DateService
  ) {
  }

  initChannels() {
    this.shopChannel = new ShopChannel(this);
  }

  loadEvents() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(AppSettings.APP_KEY)) {
        const item = localStorage.getItem(key);
        const event = JSON.parse(item);
        this.apply(event);
      }
    }
  }

  apply(event: Event, save: boolean = false) {
    this.serviceList.forEach(service => {
      if (service.accepts(event)) {
        service.apply(event, save);
      }
    });
  }

  resetModel() {
    this.serviceList.forEach(service => service.reset());
  }
}
