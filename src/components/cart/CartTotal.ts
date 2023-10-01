import Base from 'components/Base';
import Store from 'store';
import { DEFAULT_CURRENCY } from 'consts';

class CartTotal extends Base<HTMLDivElement> {
  private store: Store;
  private currency: string;
  private currencyBehind: boolean;
  private label: string;

  public constructor(store: Store) {
    const total = document.createElement('p');
    total.className = 'sc-cart-total';

    super(total);

    this.store = store;

    const { cart } = this.store.getOptions();
    this.currency = cart?.currency || DEFAULT_CURRENCY;
    this.currencyBehind = cart?.currencyBehind ?? false;
    this.label = cart?.totalLabel ?? 'Total';

    this.updateTotalText(); // init total text
    this.updateTotalText = this.updateTotalText.bind(this);

    this.store.addEventListener('cartchange', this.updateTotalText);
    this.store.addEventListener('cartclear', this.updateTotalText);
    this.store.addEventListener('seatchange', this.updateTotalText);
  }

  private updateTotalText() {
    const total = this.store.getCartTotal();
    const totalString = this.currencyBehind
      ? `${total.toFixed(2)}${this.currency}`
      : `${this.currency}${total.toFixed(2)}`
    this.element.textContent = `${this.label}: ${totalString}`;
  }
}

export default CartTotal;
