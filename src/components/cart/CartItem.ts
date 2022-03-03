import Base from 'components/Base';
import DeleteButton from 'components/cart/DeleteButton';
import CartTicket from 'components/cart/CartTicket';
import Store from 'store';
import { SeatIndex } from 'types/seat-index';
import { DEFAULT_CURRENCY } from 'utils/consts';

class CartItem extends Base<HTMLDivElement> {
  public seatIndex: SeatIndex;

  private store: Store;

  public constructor(index: SeatIndex, store: Store) {
    const cartItem = document.createElement('tr');
    super(cartItem);

    const info = store.getSeat(index);
    const typeOptions = store.getTypeOptions(info.type);
    const ticket = new CartTicket(info.label, typeOptions);

    const ticketTd = document.createElement('td');
    ticketTd.appendChild(ticket.element);

    const { cart } = store.getOptions();
    const currency = cart?.currency || DEFAULT_CURRENCY;

    const seatPriceTd = document.createElement('td');
    seatPriceTd.textContent = `${currency}${typeOptions.price.toFixed(2)}`;

    this.deleteClick = this.deleteClick.bind(this);
    const deleteBtn = new DeleteButton(this.deleteClick);

    const deleteTd = document.createElement('td');
    deleteTd.appendChild(deleteBtn.element);

    cartItem.appendChild(ticketTd);
    cartItem.appendChild(seatPriceTd);
    cartItem.appendChild(deleteTd);

    this.store = store;
    this.seatIndex = info.index;
  }

  private deleteClick() {
    this.store.setSeat(this.seatIndex, { state: 'available' }, true);
  }
}
export default CartItem;
