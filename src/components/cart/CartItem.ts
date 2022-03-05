import Base from 'components/Base';
import DeleteButton from 'components/cart/DeleteButton';
import CartTicket from 'components/cart/CartTicket';
import Store from 'store';
import { SeatIndex } from 'types/seat-index';
import { DEFAULT_CURRENCY } from 'consts';
import { SeatType } from 'types/seat-type';

class CartItem extends Base<HTMLDivElement> {
  public seatIndex: SeatIndex;

  private store: Store;
  private ticket: CartTicket;
  private seatPriceTd: HTMLTableCellElement;
  private currency: string;

  public constructor(index: SeatIndex, store: Store) {
    const cartItem = document.createElement('tr');
    super(cartItem);

    const info = store.getSeat(index);
    const typeOptions = store.getTypeOptions(info.type);
    this.ticket = new CartTicket(info.label, typeOptions);

    const ticketTd = document.createElement('td');
    ticketTd.appendChild(this.ticket.element);

    const { cart } = store.getOptions();
    this.currency = cart?.currency || DEFAULT_CURRENCY;

    this.seatPriceTd = document.createElement('td');
    this.seatPriceTd.textContent = this.getPriceLabel(typeOptions.price);

    this.deleteClick = this.deleteClick.bind(this);
    const deleteBtn = new DeleteButton(this.deleteClick);

    const deleteTd = document.createElement('td');
    deleteTd.appendChild(deleteBtn.element);

    cartItem.appendChild(ticketTd);
    cartItem.appendChild(this.seatPriceTd);
    cartItem.appendChild(deleteTd);

    this.store = store;
    this.seatIndex = info.index;
  }

  private deleteClick() {
    this.store.setSeat(this.seatIndex, { state: 'available' }, true);
  }

  private getPriceLabel(price: number) {
    return `${this.currency}${price.toFixed(2)}`;
  }

  public update(seatLabel: string, seatType: SeatType) {
    this.ticket.update(seatLabel, seatType);
    this.seatPriceTd.textContent = this.getPriceLabel(seatType.price);
  }
}
export default CartItem;
