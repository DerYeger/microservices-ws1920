import {ModelService} from '../model/model.service';
import {environment} from '../../environments/environment';
import {PalletEvent} from '../model/pallet/pallet-event';
import {UserEvent} from '../model/user/user-event';
import OrderEvent from '../model/order/order-event';


export class WarehouseChannel {

  constructor(
    private readonly model: ModelService,
  ) {
  }

  async synchronize() {
    const message = {
      greeting: 'Hello from Frontend',
      eventList: []
    };

    const palletEvents = this.model.palletService
      .pallets
      .map(pallet => PalletEvent.plainPalletDataEvent(pallet, this.model.dateService.getDate()));

    const userEvents = this.model.userService
      .users
      .map(user => UserEvent.userDataEvent(user, this.model.dateService.getDate()));

    const orderEvents = this.model.orderService
      .orders
      .map(order => OrderEvent.orderDataEvent(order, this.model.dateService.getDate()));

    message.eventList.push(...palletEvents, ...userEvents, ...orderEvents);

    const response = await this.model.httpClient
      .post(`${environment.warehouseUrl}/warehouse`, message)
      .toPromise();
    this.handleResponse(response);
  }

  private handleResponse(data: any) {
    data.eventList.forEach(dataEvent => this.model.apply(dataEvent, true));
  }
}
