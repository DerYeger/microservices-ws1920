import {Pallet} from '../pallet/pallet';
import Order from './order';
import {ModelService} from '../model.service';

export default class OrderView {
  readonly pallets: Array<Pallet>;

  constructor(readonly order: Order, model: ModelService) {
    this.pallets = model.palletService
      .pallets
      .filter(pallet => pallet.product.replace(/ /g, '-') === order.productId && pallet.state === 'storedInBackend');
  }
}
