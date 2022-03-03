import Store from 'store';
import Map from 'components/map/Map';
import Cart from 'components/cart/Cart';
import Legend from 'components/legend/Legend';

class Seatchart {
  public constructor(container: HTMLElement, store: Store) {
    container.classList.add('sc-main-container');

    const map = new Map(store);
    container.appendChild(map.element);

    const rightContainer = document.createElement('div');
    rightContainer.className = 'sc-right-container';

    const options = store.getOptions();
    if (
      !options.cart ||
      options.cart.visible === undefined ||
      options.cart.visible
    ) {
      const cart = new Cart(store);
      rightContainer?.appendChild(cart.element);
    }

    if (options.legendVisible === undefined || options.legendVisible) {
      const legend = new Legend(store);
      rightContainer?.appendChild(legend.element);
    }

    if (rightContainer.childElementCount > 0) {
      container.appendChild(rightContainer);
    }
  }
}

export default Seatchart;
