import Service from '../model/service';
import {Event} from './event';

export default interface EventService<T extends Event> extends Service {
    accepts(event: Event): boolean;

    apply(event: T, save: boolean): void;
}
