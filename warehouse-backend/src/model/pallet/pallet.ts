import User from '../user/user';

export default class Pallet {
    id: string;
    product: string;
    amount: number;
    priority: string;
    place: string;
    state: string;
    lastModified: string;
    user: User;
}
