import {Event, EventType} from '../../event/event';

export default class ProductEvent extends Event {
    readonly productId: string;
    readonly productName: string;
    readonly productAmount: number;
    readonly productLastModified: string;

    private constructor() {
        super();
    }

    static productDataEvent(name: string, amount: number, date: string): ProductEvent {
        const id = name.replace(/ /g, '-');
        return this.productEvent(`${EventType.PRODUCT_DATA}-${id}`, EventType.PRODUCT_DATA, id, name, amount, date);
    }

    private static productEvent(
        eventIdString: string,
        type: EventType,
        id: string,
        name: string,
        amount: number,
        date: string
    ): ProductEvent {
        return {
            eventId: eventIdString,
            eventType: type,
            timestamp: date,
            productId: id,
            productName: name,
            productAmount: amount,
            productLastModified: date
        };
    }
}
