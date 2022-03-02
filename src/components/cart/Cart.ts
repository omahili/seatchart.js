import CartFooter from 'components/cart/CartFooter';
import CartHeader from 'components/cart/CartHeader';
import CartTable from 'components/cart/CartTable';
import Store from 'store';

class Cart {
  private store: Store;

  public constructor(store: Store) {
    this.store = store;

    this.render();
  }

  private render(): void {
    const options = this.store.getOptions();

    if (options.cart) {
      const cartTable = new CartTable(this.store);

      const cartTableContainer = document.createElement('div');
      cartTableContainer.className = 'sc-cart-table-container';
      cartTableContainer.appendChild(cartTable.element);

      const cartHeader = new CartHeader(this.store);
      const cartFooter = new CartFooter(this.store);

      const cartContainer = document.createElement('div');
      cartContainer.className = 'sc-component sc-cart';
      cartContainer.appendChild(cartHeader.element);
      cartContainer.appendChild(cartTableContainer);
      cartContainer.appendChild(cartFooter.element);

      const cart = document.getElementById(options.cart.id);
      cart?.appendChild(cartContainer);
    }
  }
}

export default Cart;
