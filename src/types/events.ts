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

interface SeatchartEvents {
    cartchange: CartChangeEvent;
    cartclear: CartClearEvent;
    seatchange: SeatChangeEvent;
}

export {
    SeatchartEvents,
    CartChangeEvent,
    CartClearEvent,
    SeatChangeEvent,
};
