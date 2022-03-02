import { SeatInfo } from 'types/seat-info';

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
}

export { Events, CartChangeEvent, ClearEvent, SeatChangeEvent };
