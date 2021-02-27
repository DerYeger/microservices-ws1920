export default abstract class Event {
  readonly eventId: string;
  readonly eventType: EventType;
  readonly timestamp: string;
}

export enum EventType {
  USER_DATA = 'user-data',
  USER_LOGIN = 'user-login',
  USER_LOGOUT = 'user-logout',
  PRODUCT_DATA = 'product-data',
  ORDER_DATA = 'order-data'
}
