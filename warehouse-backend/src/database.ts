import {Connection, createConnection} from 'typeorm';
import EventEntity from './event/event-entity';
import config from './ormconfig';
import {Event} from './event/event';

export default class Database {
    public readonly connection: Promise<Connection>;

    constructor() {
        console.log('DB: connecting');

        this.connection = createConnection(config);

        this.connection
            .then(_ => console.log('DB: connected'))
            .catch(error => console.error('DB: connecting failed: ' + error));
    }

    public async store(event: Event) {
        const eventEntity = EventEntity.fromEvent(event);
        try {
            const theConnection = await this.connection;
            await theConnection.manager.save(EventEntity.name, eventEntity);
        } catch (error) {
            console.error('DB: error saving entity: ' + error);
        }
    }

    public async remove(eventId: string) {
        try {
            const theConnection = await this.connection;
            await theConnection.manager.delete(EventEntity, eventId);
        } catch (error) {
            console.error('DB: error deleting entity: ' + error);
        }
    }
}
