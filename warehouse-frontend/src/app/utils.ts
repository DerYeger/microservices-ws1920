import {Event} from './event/event';
import {AppSettings} from './app-settings';
import {EventType} from './event/event-type.enum';
import {Pallet} from './model/pallet/pallet';

export function saveToLocalStorage(event: Event) {
  localStorage.setItem(`${AppSettings.APP_KEY}-${event.eventId}`, JSON.stringify(event));
}

export function deleteFromLocalStorage(event: Event) {
  localStorage.removeItem(`${AppSettings.APP_KEY}-${event.eventId}`);
}

export function deleteTypeFromLocalStorage(eventType: EventType) {
  localStorage.removeItem(`${AppSettings.APP_KEY}-${eventType}`);
}

export function deletePalletFromLocalStorage(pallet: Pallet) {
  localStorage.removeItem(`${AppSettings.APP_KEY}-${EventType.PALLET_DATA}-${pallet.id}`);
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
