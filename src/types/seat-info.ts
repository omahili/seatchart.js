/**
 * Describes a seat.
 */
interface SeatInfo {
    /**
     * Seat type.
     */
    type: string;
    /**
     * Seat id.
     */
    id: string;
    /**
     * Seat index.
     */
    index: number;
    /**
     * Seat name.
     */
    name: string;
    /**
     * Seat price.
     */
    price: number | null;
}

export { SeatInfo };
