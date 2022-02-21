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

type EventListener = (e: ClearEvent | ChangeEvent) => void;

export {
    EventListener,
    ChangeEvent,
    ClearEvent,
};
