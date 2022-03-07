import Base from 'components/Base';
import CartTotal from 'components/cart/CartTotal';
import Store from 'store';
import { DEFAULT_SUBMIT_LABEL } from 'consts';

class CartFooter extends Base<HTMLDivElement> {
  public constructor(store: Store) {
    const total = new CartTotal(store);

    const container = document.createElement('div');
    container.className = 'sc-cart-footer';

    const { cart } = store.getOptions();

    const submitBtn = document.createElement('button');
    submitBtn.className = 'sc-cart-btn sc-cart-btn-submit';
    submitBtn.textContent = cart?.submitLabel || DEFAULT_SUBMIT_LABEL;
    submitBtn.type = 'button';
    submitBtn.onclick = () => store.submit();

    container.appendChild(total.element);
    container.appendChild(submitBtn);

    super(container);
  }
}

export default CartFooter;
