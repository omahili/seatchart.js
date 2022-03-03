import Base from 'components/base/Base';
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

    this.eventListener = this.eventListener.bind(this);
    this.store.addEventListener('clear', this.eventListener);
    this.store.addEventListener('cartchange', this.eventListener);
  }

  private deleteAllClick() {
    this.store.clear();
  }

  private eventListener(): void {
    const items = this.store.countCartItems();
    this.title.textContent = `Cart (${items})`;
  }
}

export default CartHeader;
