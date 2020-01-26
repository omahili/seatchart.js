import Seat from 'utils/seat';

interface ChangeEvent {
    /**
     * Action on seat ('add', 'remove' or 'update').
     */
    action: string;
    /**
     * Current seat info.
     */
    current: Seat;
    /**
     * Seat info previous to the event.
     */
    previous: Seat;
}

interface ClearEvent {
    seats: Array<{
        /**
         * Current seat info.
         */
        current: Seat;
        /**
         * Seat info previous to the event.
         */
        previous: Seat;
    }>;
}

type EventListener = (e: ClearEvent | ChangeEvent) => void;

export {
    EventListener,
    ChangeEvent,
    ClearEvent,
};
