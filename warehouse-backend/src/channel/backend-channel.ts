import ModelService from '../model/model-service';
import Axios from 'axios';
import ProductEvent from '../model/product/product-event';
import Service from '../model/service';
import OrderEvent from '../model/order/order-event';

export default class BackendChannel implements Service {

    public model: ModelService;
    private readonly shopUrl = process.env.SHOP_URL || 'http://localhost:5001';
    private readonly shopEndpoint = this.shopUrl + '/warehouse-shop';

    handle(request, response) {
        let body = '';

        request.on('data', chunk => body += chunk.toString());

        request.on('end', () => {
            this.handleParsed(JSON.parse(body), response);
        });
    }

    async synchronize() {
        try {
            const response = await Axios.post(this.shopEndpoint, this.buildMessage());
            response.data.eventList.forEach(it => this.model.apply(it));
        } catch (error) {
            console.error('Unable to reach ShopBackend: ' + error.code);
        }
    }

    private handleParsed(request, response) {
        request.eventList.forEach(it => this.model.apply(it));

        response
            .status(200)
            .send(this.buildMessage())
            .end('ok');
    }

    private buildMessage(): any {
        const message = {
            greeting: 'Hello from the WarehouseBackend',
            eventList: []
        };

        const productMap = new Map<string, number>();
        for (const pallet of this.model.palletService.pallets) {
            if (!pallet.product || pallet.state !== 'storedInBackend') {
                continue;
            }
            const shortName = pallet.product;
            productMap[shortName] = +(productMap[shortName] || 0) + +pallet.amount;
        }

        for (const product of Object.keys(productMap)) {
            const value = productMap[product];
            const productEvent = ProductEvent.productDataEvent(product, value, this.model.dateService.getDate());
            message.eventList.push(productEvent);
        }

        const orderEvents = this.model.orderService.orders.map(order => OrderEvent.orderDataEvent(order, this.model.dateService.getDate()));

        message.eventList.push(...orderEvents);

        return message;
    }
}
