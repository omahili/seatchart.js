import { SeatInfo } from 'types/seat-info';

interface SeatChangeEvent {
  seat: SeatInfo;
}

interface CartChangeEvent {
  action: 'add' | 'remove';
  seat: SeatInfo;
}

interface CartClearEvent {
  seats: Array<SeatInfo>;
}

interface Events {
  cartchange: CartChangeEvent;
  cartclear: CartClearEvent;
  seatchange: SeatChangeEvent;
}

export { Events, CartChangeEvent, CartClearEvent, SeatChangeEvent };
