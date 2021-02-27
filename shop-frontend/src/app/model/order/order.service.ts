import Order from './order';
import {Injectable} from '@angular/core';
import {EventService} from '../../event/event.service';
import OrderEvent from './order-event';
import Event, {EventType} from '../../event/event';
import {deleteFromLocalStorage, saveToLocalStorage} from '../../utils';
import {DateService} from '../date.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService implements EventService<OrderEvent> {
  private readonly orderMap: Map<string, Order> = new Map<string, Order>();

  constructor(
    private readonly dateService: DateService
  ) {
  }

  get orders(): Array<Order> {
    return [...this.orderMap.values()];
  }

  accepts(event: Event): boolean {
    return event.eventType === EventType.ORDER_DATA;
  }

  apply(event: OrderEvent, save: boolean) {
    if (event.eventType === EventType.ORDER_DATA) {
      this.loadOrder(
        event.orderId,
        event.orderProductId,
        event.orderUserId,
        event.orderBuyerName,
        event.orderBuyerAddress,
        event.orderState,
        event.orderSourcePalletId,
        event.orderLastModified
      );
    }
    if (save) {
      saveToLocalStorage(event);
    }
  }

  reset() {
    this.orders.forEach(order =>
      deleteFromLocalStorage(OrderEvent.orderDataEvent(order, this.dateService.getDate()))
    );
    this.orderMap.clear();
  }

  orderData(
    id: string,
    productId: string,
    userId: string,
    buyerName: string,
    buyerAddress: string,
    state: string,
    sourcePalletId: string,
    timestamp: string
  ): Order {
    const order = this.loadOrder(id, productId, userId, buyerName, buyerAddress, state, sourcePalletId, timestamp);
    saveToLocalStorage(OrderEvent.orderDataEvent(order, this.dateService.getDate()));
    return order;
  }

  private loadOrder(
    id: string,
    productId: string,
    userId: string,
    buyerName: string,
    buyerAddress: string,
    state: string,
    sourcePalletId: string,
    timestamp: string
  ): Order {
    const order = this.getOrCreateOrder(id);
    if (!timestamp || order.lastModified >= timestamp) {
      return order;
    }
    order.productId = productId;
    order.userId = userId;
    order.buyerName = buyerName;
    order.buyerAddress = buyerAddress;
    order.state = state;
    order.sourcePalletId = sourcePalletId;
    order.lastModified = timestamp;
    return order;
  }

  private getOrCreateOrder(id: string): Order {
    if (this.orderMap.has(id)) {
      return this.orderMap.get(id);
    }
    const newOrder = new Order();
    newOrder.id = id;
    this.orderMap.set(id, newOrder);
    return newOrder;
  }
}
