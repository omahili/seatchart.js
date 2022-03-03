import Base from 'components/Base';
import CartItem from 'components/cart/CartItem';
import Store from 'store';
import { CartChangeEvent } from 'types/events';

class CartTable extends Base<HTMLDivElement> {
  private store: Store;
  private items: CartItem[];

  public constructor(store: Store) {
    const table = document.createElement('table');
    table.className = 'sc-cart-table';

    super(table);

    this.store = store;
    this.items = [];

    this.cartEventListener = this.cartEventListener.bind(this);
    this.clearEventListener = this.clearEventListener.bind(this);

    this.store.addEventListener('cartchange', this.cartEventListener);
    this.store.addEventListener('clear', this.clearEventListener);
  }

  private cartEventListener(e: CartChangeEvent): void {
    if (e.action === 'add') {
      const cartItem = new CartItem(e.seat.index, this.store);
      this.element.appendChild(cartItem.element);
      this.items.push(cartItem);
    } else if (e.action === 'remove') {
      const index = this.items.findIndex(
        (item) =>
          item.seatIndex.row === e.seat.index.row &&
          item.seatIndex.col === e.seat.index.col
      );

      if (index >= 0) {
        this.items[index].element.remove();
        this.items.splice(index, 1);
      }
    }
  }

  private clearEventListener() {
    for (const item of this.items) {
      item.element.remove();
    }

    this.items = [];
  }
}

export default CartTable;
