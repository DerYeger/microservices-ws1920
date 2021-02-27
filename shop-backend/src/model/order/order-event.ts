import {Event, EventType} from '../../event/event';
import Order from './order';

export default class OrderEvent extends Event {
    readonly orderId: string;
    readonly orderProductId: string;
    readonly orderUserId: string;
    readonly orderBuyerName: string;
    readonly orderBuyerAddress: string;
    readonly orderState: string;
    readonly orderSourcePalletId: string;
    readonly orderLastModified: string;

    private constructor() {
        super();
    }

    static orderDataEvent(order: Order, date: string): OrderEvent {
        return this.orderEvent(`${EventType.ORDER_DATA}-${order.id}`, EventType.ORDER_DATA, order, date);
    }

    private static orderEvent(
        eventIdString: string,
        type: EventType,
        order: Order,
        date: string
    ): OrderEvent {
        return {
            eventId: eventIdString,
            eventType: type,
            timestamp: date,
            orderId: order.id,
            orderProductId: order.productId,
            orderUserId: order.userId,
            orderBuyerName: order.buyerName,
            orderBuyerAddress: order.buyerAddress,
            orderState: order.state,
            orderSourcePalletId: order.sourcePalletId,
            orderLastModified: order.lastModified,
        };
    }
}
