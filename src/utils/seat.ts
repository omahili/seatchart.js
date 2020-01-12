/**
 * @typedef {Object} Seat
 * @property {string} type - Seat type.
 * @property {number} id - Seat id.
 * @property {number} index - Seat index.
 * @property {string} name - Seat name.
 * @property {number} price - Seat price.
 */
interface Seat {
    type: string;
    id: string;
    index: number;
    name: string;
    price: number | null;
}

export default Seat;
