import Base from 'components/Base';
import { SeatType } from 'types/seat-type';

class CartTicket extends Base<HTMLDivElement> {
  public constructor(seatLabel: string, seatType: SeatType) {
    const stripes = document.createElement('div');
    stripes.className = 'sc-ticket-stripes';

    const seatLabelContainer = document.createElement('div');
    seatLabelContainer.textContent = seatLabel;
    seatLabelContainer.className = 'sc-ticket-seat-label';

    const seatTypeContainer = document.createElement('div');
    seatTypeContainer.textContent = seatType.label;
    seatTypeContainer.className = 'sc-ticket-seat-type';

    const ticket = document.createElement('div');
    ticket.className = `sc-ticket ${seatType.cssClass}`;

    ticket.appendChild(stripes);
    ticket.appendChild(seatLabelContainer);
    ticket.appendChild(seatTypeContainer);
    ticket.appendChild(stripes.cloneNode(true));

    super(ticket);
  }
}

export default CartTicket;
