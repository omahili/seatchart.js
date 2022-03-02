import Base from 'components/base/Base';
import DeleteButton from 'components/cart/DeleteButton';
import Store from 'store';
import { DEFAULT_ASSETS_SRC } from 'utils/consts';

class CartHeader extends Base<HTMLDivElement> {
  private store: Store;
  private title: HTMLParagraphElement;

  public constructor(store: Store) {
    const container = document.createElement('div');
    container.className = 'sc-cart-header';

    super(container);

    const { assetsSrc } = store.getOptions();
    const icon = document.createElement('img');
    icon.className = 'sc-cart-icon';
    icon.src = `${assetsSrc || DEFAULT_ASSETS_SRC}/shoppingcart.svg`;
    icon.alt = 'Cart icon';

    const title = document.createElement('p');
    const titleContainer = document.createElement('div');
    titleContainer.className = 'sc-cart-title';
    titleContainer.appendChild(icon);
    titleContainer.appendChild(title);

    this.deleteAllClick = this.deleteAllClick.bind(this);
    const clearButton = new DeleteButton(this.deleteAllClick, assetsSrc);

    container.appendChild(titleContainer);
    container.appendChild(clearButton.element);

    this.store = store;
    this.title = title;

    this.eventListener = this.eventListener.bind(this);
    this.store.addEventListener('cartclear', this.eventListener);
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
