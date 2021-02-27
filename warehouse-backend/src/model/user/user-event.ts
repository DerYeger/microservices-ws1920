import User from './user';
import {Event, EventType} from '../../event/event';

export default class UserEvent extends Event {
    readonly userId: string;
    readonly userName: string;
    readonly userLastModified: string;

    private constructor() {
        super();
    }

    static userDataEvent(user: User, date: string): UserEvent {
        return this.userEvent(`${EventType.USER_DATA}-${user.id}`, EventType.USER_DATA, user, date);
    }

    private static userEvent(
        eventIdString: string,
        type: EventType,
        user: User,
        date: string
    ) {
        return {
            eventId: eventIdString,
            eventType: type,
            timestamp: date,
            userId: user.id,
            userName: user.name,
            userLastModified: user.lastModified
        };
    }
}