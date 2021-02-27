import Order from './order';
import OrderEvent from './order-event';
import {Event, EventType} from '../../event/event';
import EventService from '../../event/event-service';
import ModelService from '../model-service';

export default class OrderService implements EventService<OrderEvent> {
    model: ModelService;

    private readonly orderMap: Map<string, Order> = new Map<string, Order>();

    get orders(): Array<Order> {
        return [...this.orderMap.values()];
    }

    accepts(event: Event): boolean {
        return event.eventType === EventType.ORDER_DATA;
    }

    apply(event: OrderEvent, save: boolean) {
        this.orderData(
            event.orderId,
            event.orderProductId,
            event.orderUserId,
            event.orderBuyerName,
            event.orderBuyerAddress,
            event.orderState,
            event.orderSourcePalletId,
            event.orderLastModified,
            save
        );
    }

    orderData(
        id: string,
        productId: string,
        userId: string,
        buyerName: string,
        buyerAddress: string,
        state: string,
        sourcePalletId: string,
        timestamp: string,
        save: boolean
    ): Order {
        const order = this.loadOrder(id, productId, userId, buyerName, buyerAddress, state, sourcePalletId, timestamp);
        if (save) {
            if (order.state.startsWith('pickedInWarehouseBackend')) {
                this.model.backendChannel.synchronize();
            }
            const event = OrderEvent.orderDataEvent(order, this.model.dateService.getDate());
            this.model.database.store(event);
        }
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
        if (state === 'newInShopBackend') {
            order.state = 'newInWarehouseBackend';
            order.lastModified = this.model.dateService.getDate();
        } else if (state === 'pickedInWarehouseFrontend') {
            order.state = 'pickedInWarehouseBackend';
            order.lastModified = this.model.dateService.getDate();
        }
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
