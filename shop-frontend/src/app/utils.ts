import {AppSettings} from './app-settings';
import Event, {EventType} from './event/event';

export function saveToLocalStorage(event: Event) {
  localStorage.setItem(`${AppSettings.APP_KEY}-${event.eventId}`, JSON.stringify(event));
}

export function deleteFromLocalStorage(event: Event) {
  localStorage.removeItem(`${AppSettings.APP_KEY}-${event.eventId}`);
}

export function deleteTypeFromLocalStorage(eventType: EventType) {
  localStorage.removeItem(`${AppSettings.APP_KEY}-${eventType}`);
}

export function noneAreUndefinedOrNullOrBlank(...strings: string[]): boolean {
  for (const it of strings) {
    if (isUndefinedOrNullOrBlank(it)) {
      return false;
    }
  }
  return true;
}

export function isUndefinedOrNullOrBlank(it: string): boolean {
  return !it || it.trim().length === 0;
}
