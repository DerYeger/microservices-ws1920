import PalletService from './pallet/pallet-service';
import UserService from './user/user-service';
import DateService from './date-service';
import EventService from '../event/event-service';
import Service from './service';
import {Event} from '../event/event';
import Database from '../database';
import EventEntity from '../event/event-entity';
import BackendChannel from '../channel/backend-channel';
import FrontendChannel from '../channel/frontend-channel';
import OrderService from './order/order-service';

export default class ModelService {

    private readonly eventServices = new Array<EventService<Event>>(this.palletService, this.userService, this.orderService);
    private readonly services = new Array<Service>(...this.eventServices, this.dateService, this.frontendChannel, this.backendChannel);

    constructor(
        public readonly database: Database,
        public readonly palletService: PalletService,
        public readonly userService: UserService,
        public readonly orderService: OrderService,
        public readonly dateService: DateService,
        public readonly frontendChannel: FrontendChannel,
        public readonly backendChannel: BackendChannel
    ) {
        this.services.forEach(service => service.model = this);
        this.loadDBEvents()
            .then(_ => this.backendChannel.synchronize());
    }

    apply(event: Event, save: boolean = true) {
        this.eventServices.forEach(service => {
            if (service.accepts(event)) {
                service.apply(event, save);
            }
        });
    }

    private async loadDBEvents() {
        try {
            console.log('Model: awaiting connection');
            const connection = await this.database.connection;
            console.log('Model: awaiting event list');
            const events = await connection.manager.find(EventEntity);
            console.log('Model: applying events');
            events.map(event => JSON.parse(event.eventText))
                .forEach(event => this.apply(event, false));
            console.log('Model: events applied');
            console.log(`Model: ${this.userService.users.length} users and ${this.palletService.pallets.length} pallets`);
        } catch (e) {
            console.error(`Model: ${e}`);
        }
    }
}
