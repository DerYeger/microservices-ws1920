import {EventType} from './event-type.enum';

export abstract class Event {
  readonly eventId: string;
  readonly eventType: EventType;
  readonly timestamp: string;
}
