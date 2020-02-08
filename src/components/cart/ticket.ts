import { DEFAULT_TEXT_COLOR } from 'utils/consts';
import Seat from 'utils/seat';
import utils from 'utils/utils';
import SeatType from 'utils/seat-type';
import BaseComponent from 'utils/base-component';

/**
 * @internal
 */
class CartTicket extends BaseComponent<HTMLDivElement> {
    /**
     * Creates a ticket to place into the shopping cart.
     * @param seat - Seat info.
     * @param seatType - Seat type options.
     */
    public constructor(seat: Seat, seatType: SeatType) {
        const ticket = document.createElement('div');
        ticket.className = 'sc-ticket';
        ticket.style.color = seatType.textColor || DEFAULT_TEXT_COLOR;
        ticket.style.backgroundColor = seatType.backgroundColor;

        const stripes = document.createElement('div');
        stripes.className = 'sc-ticket-stripes';

        const seatName = document.createElement('div');
        seatName.textContent = seat.name;
        seatName.className = 'sc-cart-seat-name';

        const seatTypeContainer = document.createElement('div');
        seatTypeContainer.textContent = utils.capitalizeFirstLetter(seat.type);
        seatTypeContainer.className = 'sc-cart-seat-type';

        ticket.appendChild(stripes);
        ticket.appendChild(seatName);
        ticket.appendChild(seatTypeContainer);
        ticket.appendChild(stripes.cloneNode(true));

        super(ticket);
    }
}

export default CartTicket;
