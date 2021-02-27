import EventService from '../../event/event-service';
import ModelService from '../model-service';
import {Event, EventType} from '../../event/event';
import ProductEvent from './product-event';
import Product from './product';

export default class ProductService implements EventService<ProductEvent> {
    model: ModelService;

    private readonly productMap: Map<string, Product> = new Map<string, Product>();

    get products(): Array<Product> {
        return [...this.productMap.values()];
    }

    accepts(event: Event): boolean {
        return event.eventType === EventType.PRODUCT_DATA;
    }

    apply(event: ProductEvent, save: boolean) {
        this.productData(
            event.productId,
            event.productName,
            event.productAmount,
            event.productLastModified,
            save
        );
    }

    productData(
        id: string,
        name: string,
        amount: number,
        timestamp: string,
        save: boolean
    ): Product {
        const product = this.loadProduct(id, name, amount, timestamp);
        if (save) {
            const event = ProductEvent.productDataEvent(product, this.model.dateService.getDate());
            this.model.database.store(event);
        }
        return product;
    }

    private loadProduct(
        id: string,
        name: string,
        amount: number,
        timestamp: string
    ): Product {
        const product = this.getOrCreateProduct(id);
        if (product.id === id && product.amount === amount) {
            return product;
        }
        product.name = name;
        product.amount = amount;
        product.lastModified = timestamp;
        return product;
    }

    private getOrCreateProduct(id: string): Product {
        if (this.productMap.has(id)) {
            return this.productMap.get(id);
        }
        const newProduct = new Product();
        newProduct.id = id;
        this.productMap.set(id, newProduct);
        return newProduct;
    }
}
