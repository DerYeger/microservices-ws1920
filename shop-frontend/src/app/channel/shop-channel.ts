import {ModelService} from '../model/model.service';
import {UserEvent} from '../model/user/user-event';
import {environment} from '../../environments/environment';
import OrderEvent from '../model/order/order-event';

export default class ShopChannel {

  constructor(
    private readonly model: ModelService,
  ) {
  }

  async synchronize() {
    const message = {
      greeting: 'Hello from ShopFrontend',
      userId: this.model.userService.currentUser.id,
      eventList: []
    };

    const userEvents = this.model.userService
      .users
      .map(user => UserEvent.userDataEvent(user, this.model.dateService.getDate()));

    const orderEvents = this.model.orderService
      .orders
      .map(order => OrderEvent.orderDataEvent(order, this.model.dateService.getDate()));

    message.eventList.push(...userEvents, ...orderEvents);

    const response = await this.model.httpClient
      .post(`${environment.shopUrl}/shop`, message)
      .toPromise();
    this.handleResponse(response);
  }

  private handleResponse(data: any) {
    data.eventList.forEach(dataEvent => this.model.apply(dataEvent, true));
  }
}
