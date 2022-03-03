import Base from 'components/Base';
import { SeatType } from 'types/seat-type';

class CartTicket extends Base<HTMLDivElement> {
  public constructor(seatName: string, seatType: SeatType) {
    const stripes = document.createElement('div');
    stripes.className = 'sc-ticket-stripes';

    const seatNameContainer = document.createElement('div');
    seatNameContainer.textContent = seatName;
    seatNameContainer.className = 'sc-ticket-seat-name';

    const seatTypeContainer = document.createElement('div');
    seatTypeContainer.textContent = seatType.name;
    seatTypeContainer.className = 'sc-ticket-seat-type';

    const ticket = document.createElement('div');
    ticket.className = `sc-ticket ${seatType.cssClass}`;

    ticket.appendChild(stripes);
    ticket.appendChild(seatNameContainer);
    ticket.appendChild(seatTypeContainer);
    ticket.appendChild(stripes.cloneNode(true));

    super(ticket);
  }
}

export default CartTicket;
