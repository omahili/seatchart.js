import LegendItem from 'components/legend/LegendItem';
import Store from 'store';
import { DEFAULT_CURRENCY } from 'utils/consts';

class Legend {
  private store: Store;

  public constructor(store: Store) {
    this.store = store;

    this.render();
  }

  private render(): void {
    const { legendId, cart, map } = this.store.getOptions();
    if (legendId) {
      const list = document.createElement('ul');
      list.className = 'sc-component sc-legend';

      const currency = cart?.currency || DEFAULT_CURRENCY;
      const seatTypesOptions = map.seatTypes;

      const types = Object.keys(seatTypesOptions);
      types.sort(
        (a, b) => seatTypesOptions[b].price - seatTypesOptions[a].price
      );

      for (const type of types) {
        const seatType = seatTypesOptions[type];
        const description = `${seatType.name} (${currency}${seatType.price})`;
        const item = new LegendItem(description, seatType.cssClass);
        list.appendChild(item.element);
      }

      const reservedItem = new LegendItem('Reserved', 'sc-seat-reserved');
      list.appendChild(reservedItem.element);

      const legendContainer = document.getElementById(legendId);
      legendContainer?.appendChild(list);
    }
  }
}

export default Legend;
