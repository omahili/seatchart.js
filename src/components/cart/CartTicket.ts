import Base from 'components/Base';
import { SeatType } from 'types/seat-type';

class CartTicket extends Base<HTMLDivElement> {
  private seatTypeContainer: HTMLDivElement;
  private seatLabelContainer: HTMLDivElement;

  public constructor(seatLabel: string, seatType: SeatType) {
    const ticket = document.createElement('div');
    ticket.className = `sc-ticket ${seatType.cssClass}`;

    super(ticket);

    const stripes = document.createElement('div');
    stripes.className = 'sc-ticket-stripes';

    this.seatLabelContainer = document.createElement('div');
    this.seatLabelContainer.textContent = seatLabel;
    this.seatLabelContainer.className = 'sc-ticket-seat-label';

    this.seatTypeContainer = document.createElement('div');
    this.seatTypeContainer.textContent = seatType.label;
    this.seatTypeContainer.className = 'sc-ticket-seat-type';

    ticket.appendChild(stripes);
    ticket.appendChild(this.seatLabelContainer);
    ticket.appendChild(this.seatTypeContainer);
    ticket.appendChild(stripes.cloneNode(true));
  }

  public update(seatLabel: string, seatType: SeatType) {
    this.element.className = `sc-ticket ${seatType.cssClass}`;
    this.seatTypeContainer.textContent = seatType.label;
    this.seatLabelContainer.textContent = seatLabel;
  }
}

export default CartTicket;
