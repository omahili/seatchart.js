import Seat from 'utils/seat';

/**
 * @typedef {Object} ChangeEvent
 * @property {string} action - Action on seat ('add', 'remove' or 'update').
 * @property {Seat} current - Current seat info.
 * @property {Seat} previous - Seat info previous to the event.
 */
interface ChangeEvent {
    action: string;
    current: Seat;
    previous: Seat;
}

/**
 * @typedef {Array.<Object>} ClearEvent
 * @property {Seat} current - Current seat info.
 * @property {Seat} previous - Seat info previous to the event.
 */
type ClearEvent = Array<{
    current: Seat;
    previous: Seat;
}>;

export {
    ChangeEvent,
    ClearEvent,
};
