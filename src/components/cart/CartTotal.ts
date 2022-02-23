import Base from 'components/base/Base';
import Store from 'store';
import { DEFAULT_CURRENCY } from 'utils/consts';

class CartTotal extends Base<HTMLDivElement> {
    private store: Store;

    public constructor(store: Store) {
        const total = document.createElement('p');
        total.className = 'sc-cart-total';

        super(total);

        this.store = store;
        this.eventListener = this.eventListener.bind(this);
        this.store.addEventListener('cartchange', this.eventListener);
        this.store.addEventListener('cartclear', this.eventListener);
    }

    private eventListener() {
        const total = this.store.getCartTotal();
        const {cart} = this.store.getOptions();
        const currency = cart?.currency || DEFAULT_CURRENCY;

        this.element.textContent = `Total: ${currency}${total.toFixed(2)}`;
    }
}

export default CartTotal;
