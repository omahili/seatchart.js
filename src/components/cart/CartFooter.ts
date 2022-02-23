import Base from 'components/base/Base';
import CartTotal from 'components/cart/CartTotal';
import Store from 'store';

class CartFooter extends Base<HTMLDivElement> {
    public constructor(store: Store) {
        const total = new CartTotal(store);

        const container = document.createElement('div');
        container.className = 'sc-cart-total-container';
        container.appendChild(total.element);

        super(container);
    }
}

export default CartFooter;
