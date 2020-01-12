import Seat from 'utils/seat';

/**
 * @internal
 */
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

/**
 * @internal
 */
type ClearEvent = Array<{
    /**
     * Current seat info.
     */
    current: Seat;
    /**
     * Seat info previous to the event.
     */
    previous: Seat;
}>;

export {
    ChangeEvent,
    ClearEvent,
};
