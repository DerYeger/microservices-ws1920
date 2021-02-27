import {User} from '../user/user';

export class Pallet {
  id: string;
  product: string;
  amount: number;
  priority: string;
  place: string;
  state: string;
  user: User;
  lastModified: string;
}
