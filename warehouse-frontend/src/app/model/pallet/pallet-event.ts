import {Event} from '../../event/event';
import {Pallet} from './pallet';
import {EventType} from '../../event/event-type.enum';
import {User} from '../user/user';

export class PalletEvent extends Event {

  readonly palletId: string;
  readonly palletProduct: string;
  readonly palletAmount: number;
  readonly palletPriority: string;
  readonly palletPlace: string;
  readonly palletState: string;
  readonly palletUserId: string;
  readonly palletLastModified: string;

  private constructor() {
    super();
  }

  static palletDataEvent(pallet: Pallet, user: User, date: string): PalletEvent {
    return this.palletEvent(`${EventType.PALLET_DATA}-${pallet.id}`, EventType.PALLET_DATA, pallet, user, date);
  }

  static plainPalletDataEvent(pallet: Pallet, date: string): PalletEvent {
    return {
      eventId: `${EventType.PALLET_DATA}-${pallet.id}`,
      eventType: EventType.PALLET_DATA,
      timestamp: date,
      palletId: pallet.id,
      palletProduct: pallet.product,
      palletAmount: pallet.amount,
      palletPriority: pallet.priority,
      palletPlace: pallet.place,
      palletState: pallet.state,
      palletUserId: pallet.user.id,
      palletLastModified: pallet.lastModified
    };
  }

  private static palletEvent(
    eventIdString: string,
    type: EventType,
    pallet: Pallet,
    user: User,
    date: string
  ) {
    return {
      eventId: eventIdString,
      eventType: type,
      timestamp: date,
      palletId: pallet.id,
      palletProduct: pallet.product,
      palletAmount: pallet.amount,
      palletPriority: pallet.priority,
      palletPlace: pallet.place,
      palletState: pallet.state,
      palletUserId: user.id,
      palletLastModified: pallet.lastModified
    };
  }
}
