import {ConnectionOptions} from 'typeorm';
import EventEntity from './event/event-entity';

const config: ConnectionOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5433/shop-events',
    entities: [
        EventEntity
    ],
    synchronize: true,
};

export default config;
