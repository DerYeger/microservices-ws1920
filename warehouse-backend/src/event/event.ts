export abstract class Event {
    readonly eventId: string;
    readonly eventType: EventType;
    readonly timestamp: string;
}

export const enum EventType {
    USER_DATA = 'user-data',
    PALLET_DATA = 'pallet-data',
    PRODUCT_DATA = 'product-data',
    ORDER_DATA = 'order-data'
}
