import User from './user';
import UserEvent from './user-event';
import EventService from '../../event/event-service';
import {Event, EventType} from '../../event/event';
import ModelService from '../model-service';

export default class UserService implements EventService<UserEvent> {
    model: ModelService;

    private userMap: Map<string, User> = new Map<string, User>();

    get users(): Array<User> {
        return [...this.userMap.values()];
    }

    accepts(event: Event): boolean {
        return event.eventType === EventType.USER_DATA;
    }

    apply(event: UserEvent, save: boolean) {
        this.userData(event.userId, event.userName, event.userLastModified, save);
    }

    userData(
        id: string,
        name: string,
        timestamp: string,
        save: boolean
    ): User {
        const user = this.loadUser(id, name, timestamp);
        if (save) {
            const event = UserEvent.userDataEvent(user, this.model.dateService.getDate());
            this.model.database.store(event);
        }
        return user;
    }

    getOrCreateUser(id: string): User {
        if (this.userMap.has(id)) {
            return this.userMap.get(id);
        }
        const newUser = new User();
        newUser.id = id;
        this.userMap.set(id, newUser);
        return newUser;
    }

    private loadUser(
        id: string,
        name: string,
        timestamp: string
    ): User {
        const user = this.getOrCreateUser(id);
        if (!timestamp || user.lastModified >= timestamp) {
            return user;
        }
        user.name = name;
        user.lastModified = timestamp;
        return user;
    }
}
