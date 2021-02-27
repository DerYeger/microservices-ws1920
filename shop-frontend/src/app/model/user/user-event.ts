import {User} from './user';
import Event, {EventType} from '../../event/event';

export class UserEvent extends Event {

  static readonly eventTypes: Array<EventType> = [
    EventType.USER_DATA,
    EventType.USER_LOGIN,
    EventType.USER_LOGOUT
  ];

  readonly userId: string;
  readonly userName: string;
  readonly userLastModified: string;

  private constructor() {
    super();
  }

  static userDataEvent(user: User, date: string): UserEvent {
    return this.userEvent(`${EventType.USER_DATA}-${user.id}`, EventType.USER_DATA, user, date);
  }

  static userLoginEvent(user: User, date: string): UserEvent {
    return this.userEvent(EventType.USER_LOGIN, EventType.USER_LOGIN, user, date);
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
