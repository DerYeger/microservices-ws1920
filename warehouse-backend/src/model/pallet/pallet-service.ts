import Pallet from './pallet';
import User from '../user/user';
import PalletEvent from './pallet-event';
import EventService from '../../event/event-service';
import ModelService from '../model-service';
import {Event, EventType} from '../../event/event';

export default class PalletService implements EventService<PalletEvent> {
    model: ModelService;

    private palletMap: Map<string, Pallet> = new Map<string, Pallet>();

    get pallets(): Array<Pallet> {
        return [...this.palletMap.values()];
    }

    accepts(event: Event): boolean {
        return event.eventType === EventType.PALLET_DATA;
    }

    apply(event: PalletEvent, save: boolean) {
        const user = this.model.userService.getOrCreateUser(event.palletUserId);
        this.palletData(
            event.palletId,
            event.palletProduct,
            event.palletAmount,
            event.palletPriority,
            event.palletPlace,
            event.palletState,
            user,
            event.palletLastModified,
            save
        );
    }

    palletData(
        id: string,
        product: string,
        amount: number,
        priority: string,
        place: string,
        state: string,
        user: User,
        timestamp: string,
        save: boolean
    ) {
        const pallet = this.loadPallet(id, product, amount, priority, place, state, user, timestamp);
        if (save) {
            if (pallet.state === 'storedInBackend') {
                this.model.backendChannel.synchronize();
            }
            const event = PalletEvent.plainPalletDataEvent(pallet, this.model.dateService.getDate());
            this.model.database.store(event);
        }
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
        if (state.includes('Frontend')) {
            pallet.state = state.replace('Frontend', 'Backend');
            pallet.lastModified = this.model.dateService.getDate();
        }
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
