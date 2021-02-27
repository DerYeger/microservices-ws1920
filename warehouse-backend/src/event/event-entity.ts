import {Column, Entity, PrimaryColumn} from 'typeorm';
import {Event} from './event';

@Entity()
export default class EventEntity {

    @PrimaryColumn()
    readonly eventId: string;

    @Column()
    readonly eventText: string;

    static fromEvent(event: Event): EventEntity {
        return {
            eventId: event.eventId,
            eventText: JSON.stringify(event)
        };
    }
}
