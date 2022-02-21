import { SeatInfo } from 'types/seat-info';

interface ChangeEvent {
    /**
     * Action on seat ('add', 'remove' or 'update').
     */
    action: string;
    /**
     * Current seat info.
     */
    current: SeatInfo;
    /**
     * Seat info previous to the event.
     */
    previous: SeatInfo;
}

interface ClearEvent {
    seats: Array<{
        /**
         * Current seat info.
         */
        current: SeatInfo;
        /**
         * Seat info previous to the event.
         */
        previous: SeatInfo;
    }>;
}

interface EventMap {
    clear: ClearEvent;
    change: ChangeEvent;
}

export {
    EventMap,
    ChangeEvent,
    ClearEvent,
};
