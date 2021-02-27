import ModelService from '../model/model-service';
import PalletEvent from '../model/pallet/pallet-event';
import UserEvent from '../model/user/user-event';
import {EventType} from '../event/event';
import Service from '../model/service';
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
            greeting: 'Hello from the WarehouseBackend',
            eventList: []
        };

        body.eventList.forEach(event => this.model.apply(event));

        const frontendPalletEvents = new Set(
            body.eventList
                .filter(event => event.eventType === EventType.PALLET_DATA)
                .map(event => event.palletId)
        );

        const orderPallets = new Set(
            this.model.orderService
                .orders
                .filter(order => order.state === 'newInWarehouseBackend')
                .map(order => order.productId)
        );

        const orderEvents = this.model.orderService
            .orders
            .filter(order => order.state === 'newInWarehouseBackend')
            .map(order => OrderEvent.orderDataEvent(order, this.model.dateService.getDate()));

        const palletEvents = this.model.palletService
            .pallets
            .filter(pallet => !pallet.place || frontendPalletEvents.has(pallet.id) || orderPallets.has(pallet.product.replace(/ /g, '-')))
            .map(pallet => PalletEvent.plainPalletDataEvent(pallet, this.model.dateService.getDate()));

        const userEvents = this.model.userService
            .users
            .map(user => UserEvent.userDataEvent(user, this.model.dateService.getDate()));

        message.eventList.push(...palletEvents, ...userEvents, ...orderEvents);

        response
            .status(200)
            .send(message)
            .end('ok');
    }
}
