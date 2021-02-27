import Event from './event';

export interface EventService<T extends Event> {
  accepts(event: Event): boolean;

  apply(event: T, save: boolean): void;

  reset(): void;
}
