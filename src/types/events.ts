import { SeatInfo } from 'types/seat-info';

interface SeatChangeEvent {
  /**
   * Seat info prior to the change.
   */
  previous: SeatInfo;
  /**
   * Reference to the current seat info.
   */
  current: SeatInfo;
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

interface CartClearEvent {
  /**
   * Array of cleared seats.
   */
  seats: Array<SeatInfo>;
}

interface SubmitEvent {
  /**
   * Array containing selected seats.
   */
  cart: SeatInfo[];
  /**
   * Total price of the selected seats.
   */
  total: number;
}

interface Events {
  /**
   * An event emitted when the cart is cleared from all its items.
   */
  cartclear: CartClearEvent;
  /**
   * An event emitted when the cart changes.
   * More specifically when a seat is selected, unselected, removed from the cart or on cart clear.
   */
  cartchange: CartChangeEvent;
  /**
   * An event emitted when a seat changes.
   * More specifically when a seat is selected, unselected, removed from the cart or on cart clear.
   */
  seatchange: SeatChangeEvent;
  /**
   * An event emitted when the submit button is pressed.
   */
  submit: SubmitEvent;
}

export {
  Events,
  CartChangeEvent,
  CartClearEvent,
  SeatChangeEvent,
  SubmitEvent,
};
