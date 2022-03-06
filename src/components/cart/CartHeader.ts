import Base from 'components/Base';
import DeleteButton from 'components/cart/DeleteButton';
import Store from 'store';

class CartHeader extends Base<HTMLDivElement> {
  private store: Store;
  private title: HTMLParagraphElement;

  public constructor(store: Store) {
    const container = document.createElement('div');
    container.className = 'sc-cart-header';

    super(container);

    const title = document.createElement('p');
    title.className = 'sc-cart-title';

    this.deleteAllClick = this.deleteAllClick.bind(this);
    const clearButton = new DeleteButton(this.deleteAllClick);

    container.appendChild(title);
    container.appendChild(clearButton.element);

    this.store = store;
    this.title = title;

    this.updateCartTitle(); // init title text
    this.updateCartTitle = this.updateCartTitle.bind(this);
    this.store.addEventListener('cartclear', this.updateCartTitle);
    this.store.addEventListener('cartchange', this.updateCartTitle);
  }

  private deleteAllClick() {
    this.store.clearCart(true);
  }

  private updateCartTitle(): void {
    const count = this.store.countCartItems();
    this.title.textContent = `Cart (${count})`;
  }
}

export default CartHeader;
