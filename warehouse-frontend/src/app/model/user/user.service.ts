import {Injectable} from '@angular/core';
import {User} from './user';
import {EventService} from '../../event/event-service';
import {EventType} from '../../event/event-type.enum';
import {UserEvent} from './user-event';
import {Event} from '../../event/event';
import {deleteTypeFromLocalStorage, saveToLocalStorage} from '../../utils';
import {DateService} from '../date.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements EventService<UserEvent> {
  private readonly userMap: Map<string, User> = new Map<string, User>();

  private currentUserField: User = null;
  private currentUserSetTimestamp: string = null;

  constructor(
    private readonly dateService: DateService
  ) {
  }

  get currentUser(): User {
    return this.currentUserField;
  }

  set currentUser(user: User) {
    if (user) {
      this.currentUserField = user;
      const event = UserEvent.userLoginEvent(user, this.dateService.getDate());
      this.currentUserSetTimestamp = event.timestamp;
      saveToLocalStorage(event);
    } else if (this.currentUserField) {
      deleteTypeFromLocalStorage(EventType.USER_LOGIN);
      this.currentUserField = null;
    }
  }

  get users(): Array<User> {
    return [...this.userMap.values()];
  }

  accepts(event: Event): boolean {
    return UserEvent.eventTypes.includes(event.eventType);
  }

  apply(event: UserEvent, save: boolean) {
    if (event.eventType === EventType.USER_DATA) {
      this.loadUser(event.userId, event.userName, event.userLastModified);
    } else if (event.eventType === EventType.USER_LOGIN) {
      if (this.currentUserSetTimestamp === null || event.timestamp > this.currentUserSetTimestamp) {
        this.currentUserField = this.getOrCreateUser(event.userId);
        this.currentUserSetTimestamp = event.timestamp;
      }
    } else if (event.eventType === EventType.USER_LOGOUT) {
      if (this.currentUserSetTimestamp === null || event.timestamp > this.currentUserSetTimestamp) {
        this.currentUserField = null;
        this.currentUserSetTimestamp = event.timestamp;
      }
    }
    if (save) {
      saveToLocalStorage(event);
    }
  }

  reset() {
    this.currentUser = null;
  }

  userData(
    id: string,
    name: string,
    timestamp: string
  ): User {
    const user = this.loadUser(id, name, timestamp);
    saveToLocalStorage(UserEvent.userDataEvent(user, this.dateService.getDate()));
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
