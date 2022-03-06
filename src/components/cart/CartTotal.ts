import Base from 'components/Base';
import Store from 'store';
import { DEFAULT_CURRENCY } from 'consts';

class CartTotal extends Base<HTMLDivElement> {
  private store: Store;
  private currency: string;

  public constructor(store: Store) {
    const total = document.createElement('p');
    total.className = 'sc-cart-total';

    super(total);

    this.store = store;

    const { cart } = this.store.getOptions();
    this.currency = cart?.currency || DEFAULT_CURRENCY;

    this.updateTotalText(); // init total text
    this.updateTotalText = this.updateTotalText.bind(this);

    this.store.addEventListener('cartchange', this.updateTotalText);
    this.store.addEventListener('cartclear', this.updateTotalText);
    this.store.addEventListener('seatchange', this.updateTotalText);
  }

  private updateTotalText() {
    const total = this.store.getCartTotal();
    this.element.textContent = `Total: ${this.currency}${total.toFixed(2)}`;
  }
}

export default CartTotal;
