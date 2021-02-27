import Service from '../model/service';
import ModelService from '../model/model-service';
import UserEvent from '../model/user/user-event';
import ProductEvent from '../model/product/product-event';
import OrderEvent from '../model/order/order-event';

export default class FrontendChannel implements Service {
    public model: ModelService;

    handle(request, response) {
        let body = '';

        request.on('data', chunk => body += chunk.toString());

        request.on('end', () => {
            this.handleParsed(JSON.parse(body), response);
        });
    }

    private handleParsed(body, response) {
        const message = {
            greeting: 'Hello from the ShopBackend',
            eventList: []
        };

        const userId = body.userId;

        body.eventList.forEach(event => this.model.apply(event));

        const userEvents = this.model.userService
            .users
            .map(user => UserEvent.userDataEvent(user, this.model.dateService.getDate()));

        const productEvents = this.model.productService
            .products
            .map(product => ProductEvent.productDataEvent(product, this.model.dateService.getDate()));

        const orderEvents = this.model.orderService
            .orders
            .filter(order => order.userId === userId)
            .map(order => OrderEvent.orderDataEvent(order, this.model.dateService.getDate()));

        message.eventList.push(...userEvents, ...productEvents, ...orderEvents);

        response
            .status(200)
            .send(message)
            .end('ok');
    }
}
