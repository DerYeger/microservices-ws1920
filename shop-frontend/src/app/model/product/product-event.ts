import Product from './product';
import Event, {EventType} from '../../event/event';

export default class ProductEvent extends Event {
  readonly productId: string;
  readonly productName: string;
  readonly productAmount: number;
  readonly productLastModified: string;

  private constructor() {
    super();
  }

  static productDataEvent(product: Product, date: string): ProductEvent {
    return this.productEvent(`${EventType.PRODUCT_DATA}-${product.id}`, EventType.PRODUCT_DATA, product, date);
  }

  private static productEvent(
    eventIdString: string,
    type: EventType,
    product: Product,
    date: string
  ): ProductEvent {
    return {
      eventId: eventIdString,
      eventType: type,
      timestamp: date,
      productId: product.id,
      productName: product.name,
      productAmount: product.amount,
      productLastModified: product.lastModified
    };
  }
}
