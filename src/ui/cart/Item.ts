import { SeatInfo } from 'types/seat-info';
import { DEFAULT_CURRENCY } from 'utils/consts';
import BaseUI from 'ui/base/Base';
import { SeatType } from 'types/seat-type';
import DeleteButtonUI from 'ui/cart/DeleteButton';
import CartTicketUI from 'ui/cart/Ticket';

/**
 * @internal
 */
class CartItemUI extends BaseUI<HTMLDivElement> {
    /**
     * Creates a shopping cart item.
     * @param seat - Seat info.
     * @param currency - Currency.
     * @param assetsPath - Path to assets.
     * @param seatType - Seat type options.
     * @param deleteClick - Function called on delete click event.
     */
    public constructor(
        seat: SeatInfo,
        currency: string | undefined,
        assetsPath: string | undefined,
        seatType: SeatType,
        deleteClick: (item: HTMLElement) => (e: MouseEvent) => void
    ) {
        if (!seat.price) {
            throw new Error('Seat price cannot be null or undefined.');
        }

        const item = document.createElement('tr');

        const ticketTd = document.createElement('td');
        ticketTd.className = 'sc-ticket-container';

        const ticket = new CartTicketUI(seat, seatType);
        ticketTd.appendChild(ticket.element);

        const seatPrice = document.createElement('td');
        seatPrice.textContent = `${currency || DEFAULT_CURRENCY}${seat.price.toFixed(2)}`;

        const deleteTd = document.createElement('td');
        const deleteBtn = new DeleteButtonUI(assetsPath, deleteClick(item));

        deleteTd.appendChild(deleteBtn.element);

        item.setAttribute('id', `item-${seat.id}`);
        item.appendChild(ticketTd);
        item.appendChild(seatPrice);
        item.appendChild(deleteTd);

        super(item);
    }
}
export default CartItemUI;
