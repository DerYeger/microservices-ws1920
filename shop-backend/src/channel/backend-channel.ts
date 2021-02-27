import ModelService from '../model/model-service';
import Service from '../model/service';
import OrderEvent from '../model/order/order-event';
import Axios from 'axios';

export default class BackendChannel implements Service {

    public model: ModelService;
    private readonly warehouseUrl = process.env.WAREHOUSE_URL || 'http://localhost:5000';
    private readonly warehouseEndpoint = this.warehouseUrl + '/shop-warehouse';

    handle(request, response) {
        let body = '';

        request.on('data', chunk => body += chunk.toString());

        request.on('end', () => {
            this.handleParsed(JSON.parse(body), response);
        });
    }

    async synchronize() {
        try {
            const response = await Axios.post(this.warehouseEndpoint, this.buildMessage());
            response.data.eventList.forEach(it => this.model.apply(it));
        } catch (error) {
            console.error('Unable to reach WarehouseBackend: ' + error.code);
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
            greeting: 'Hello from the ShopBackend',
            eventList: []
        };

        const orderEvents = this.model.orderService.orders.map(order => OrderEvent.orderDataEvent(order, this.model.dateService.getDate()));

        message.eventList.push(...orderEvents);

        return message;
    }
}
