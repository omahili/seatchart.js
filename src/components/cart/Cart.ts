import Base from 'components/Base';
import CartFooter from 'components/cart/CartFooter';
import CartHeader from 'components/cart/CartHeader';
import CartTable from 'components/cart/CartTable';
import Store from 'store';

class Cart extends Base<HTMLDivElement> {
  public constructor(store: Store) {
    const cartTable = new CartTable(store);

    const cartTableContainer = document.createElement('div');
    cartTableContainer.className = 'sc-cart-table-container';
    cartTableContainer.appendChild(cartTable.element);

    const cartHeader = new CartHeader(store);
    const cartFooter = new CartFooter(store);

    const cartContainer = document.createElement('div');
    cartContainer.className = 'sc-cart';
    cartContainer.appendChild(cartHeader.element);
    cartContainer.appendChild(cartTableContainer);
    cartContainer.appendChild(cartFooter.element);

    super(cartContainer);
  }
}

export default Cart;
