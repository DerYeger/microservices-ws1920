import {Injectable} from '@angular/core';
import {EventService} from '../../event/event-service';
import {PalletEvent} from './pallet-event';
import {Event} from '../../event/event';
import {EventType} from '../../event/event-type.enum';
import {Pallet} from './pallet';
import {saveToLocalStorage} from '../../utils';
import {User} from '../user/user';
import {UserService} from '../user/user.service';
import {DateService} from '../date.service';

@Injectable({
  providedIn: 'root'
})
export class PalletService implements EventService<PalletEvent> {
  currentPallet: Pallet = null;
  private readonly palletMap: Map<string, Pallet> = new Map<string, Pallet>();

  constructor(
    private readonly userService: UserService,
    private readonly dateService: DateService
  ) {
  }

  get pallets(): Array<Pallet> {
    return [...this.palletMap.values()];
  }

  accepts(event: Event): boolean {
    return event.eventType === EventType.PALLET_DATA;
  }

  apply(event: PalletEvent, save: boolean) {
    if (event.eventType === EventType.PALLET_DATA) {
      const user = this.userService.getOrCreateUser(event.palletUserId);
      this.loadPallet(
        event.palletId,
        event.palletProduct,
        event.palletAmount,
        event.palletPriority,
        event.palletPlace,
        event.palletState,
        user,
        event.palletLastModified
      );
    }
    if (save) {
      saveToLocalStorage(event);
    }
  }

  reset() {
    this.currentPallet = null;
  }

  palletData(
    id: string,
    product: string,
    amount: number,
    priority: string,
    place: string,
    state: string,
    user: User,
    timestamp: string
  ) {
    const pallet = this.loadPallet(id, product, amount, priority, place, state, user, timestamp);
    saveToLocalStorage(PalletEvent.palletDataEvent(pallet, user, this.dateService.getDate()));
    return pallet;
  }

  private loadPallet(
    id: string,
    product: string,
    amount: number,
    priority: string,
    place: string,
    state: string,
    user: User,
    timestamp: string
  ) {
    const pallet = this.getOrCreatePallet(id);
    if (!timestamp || pallet.lastModified >= timestamp) {
      return pallet;
    }
    pallet.product = product;
    pallet.amount = amount;
    pallet.priority = priority;
    pallet.place = place;
    pallet.state = state;
    pallet.lastModified = timestamp;
    pallet.user = user;
    // if (pallet.state === 'storedInBackend') { // remove it
    //   this.palletMap.delete(pallet.id);
    //   deletePalletFromLocalStorage(pallet);
    // }
    return pallet;
  }

  private getOrCreatePallet(id: string) {
    if (this.palletMap.has(id)) {
      return this.palletMap.get(id);
    }
    const newPallet = new Pallet();
    newPallet.id = id;
    this.palletMap.set(id, newPallet);
    return newPallet;
  }
}
