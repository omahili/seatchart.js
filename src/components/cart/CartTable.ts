import Base from 'components/Base';
import CartItem from 'components/cart/CartItem';
import Store from 'store';
import { CartChangeEvent, SeatChangeEvent } from 'types/events';
import { SeatIndex } from 'types/seat-index';

class CartTable extends Base<HTMLDivElement> {
  private store: Store;
  private items: CartItem[];

  public constructor(store: Store) {
    const table = document.createElement('table');
    table.className = 'sc-cart-table';

    super(table);

    this.store = store;
    this.items = [];

    this.cartChangeEventListener = this.cartChangeEventListener.bind(this);
    this.cartClearEventListener = this.cartClearEventListener.bind(this);
    this.seatChangeEventListener = this.seatChangeEventListener.bind(this);

    this.store.addEventListener('cartchange', this.cartChangeEventListener);
    this.store.addEventListener('cartclear', this.cartClearEventListener);
    this.store.addEventListener('seatchange', this.seatChangeEventListener);
  }

  private findItem(index: SeatIndex) {
    return this.items.findIndex(
      (item) =>
        item.seatIndex.row === index.row && item.seatIndex.col === index.col
    );
  }

  private cartChangeEventListener(e: CartChangeEvent): void {
    if (e.action === 'add') {
      const cartItem = new CartItem(e.seat.index, this.store);
      this.element.appendChild(cartItem.element);
      this.items.push(cartItem);
    } else if (e.action === 'remove') {
      const index = this.findItem(e.seat.index);

      if (index >= 0) {
        this.items[index].element.remove();
        this.items.splice(index, 1);
      }
    }
  }

  private cartClearEventListener() {
    for (const item of this.items) {
      item.element.remove();
    }

    this.items = [];
  }

  private seatChangeEventListener(e: SeatChangeEvent) {
    const index = this.findItem(e.current.index);

    if (index >= 0) {
      const { map } = this.store.getOptions();
      const seatType = map.seatTypes[e.current.type];
      this.items[index].update(e.current.label, seatType);
    }
  }
}

export default CartTable;
