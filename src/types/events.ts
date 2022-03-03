import { SeatInfo } from 'types/seat-info';
import { SeatIndex } from 'types/seat-index';

interface SeatChangeEvent {
  seat: SeatInfo;
}

interface CartChangeEvent {
  /**
   * Action type.
   */
  action: 'add' | 'remove';
  /**
   * Info of the seat regarding the cart change.
   */
  seat: SeatInfo;
}

interface ClearEvent {
  /**
   * Array of cleared seats.
   */
  seats: Array<SeatInfo>;
}

interface SubmitEvent {
  /**
   * Object containing selected seats mapped by type.
   */
  cart: { [seatTypeKey: string]: SeatIndex[] };
  /**
   * Total price of the selected seats.
   */
  total: number;
}

interface Events {
  /**
   * An event triggered when the shopping cart is cleared from all its items.
   */
  clear: ClearEvent;
  /**
   * An event triggered when the shopping cart changes.
   * More specifically when a seat is selected, unselected, removed from the cart or on clear.
   */
  cartchange: CartChangeEvent;
  /**
   * An event triggered when a seat changes.
   * More specifically when a seat is selected, unselected, removed from the cart or on clear.
   */
  seatchange: SeatChangeEvent;
  /**
   * An event triggered when the submit button is pressed.
   */
  submit: SubmitEvent;
}

export { Events, CartChangeEvent, ClearEvent, SeatChangeEvent, SubmitEvent };
