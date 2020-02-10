import Seat from 'types/seat';
import { DEFAULT_CURRENCY } from 'utils/consts';
import BaseComponent from 'components/base';
import SeatType from 'types/seat-type';
import DeleteButton from './delete-button';
import CartTicket from './ticket';

/**
 * @internal
 */
class CartItem extends BaseComponent<HTMLDivElement> {
    /**
     * Creates a shopping cart item.
     * @param seat - Seat info.
     * @param currency - Currency.
     * @param assetsPath - Path to assets.
     * @param seatType - Seat type options.
     * @param deleteClick - Function called on delete click event.
     */
    public constructor(
        seat: Seat,
        currency: string | undefined,
        assetsPath: string | undefined,
        seatType: SeatType,
        deleteClick: (item: HTMLElement) => any
    ) {
        if (!seat.price) {
            throw new Error('Seat price cannot be null or undefined.');
        }

        const item = document.createElement('tr');

        const ticketTd = document.createElement('td');
        ticketTd.className = 'sc-ticket-container';

        const ticket = new CartTicket(seat, seatType);
        ticketTd.appendChild(ticket.element);

        const seatPrice = document.createElement('td');
        seatPrice.textContent = `${currency || DEFAULT_CURRENCY}${seat.price.toFixed(2)}`;

        const deleteTd = document.createElement('td');
        const deleteBtn = new DeleteButton(assetsPath, deleteClick(item));

        deleteTd.appendChild(deleteBtn.element);

        item.setAttribute('id', `item-${seat.id}`);
        item.appendChild(ticketTd);
        item.appendChild(seatPrice);
        item.appendChild(deleteTd);

        super(item);
    }
}
export default CartItem;
