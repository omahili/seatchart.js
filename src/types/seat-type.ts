import { SeatIndex } from "types/map-options";

/**
 * Seat type options.
 */
interface SeatType {
    /**
     * Name of seat type.
     */
    type: string;
    /**
     * Background color of the defined seat type.
     */
    backgroundColor: string;
    /**
     * Price of the defined seat type.
     */
    price: number;
    /**
     * Text color of the defined seat type.
     */
    textColor?: string;
    /**
     * Selected seats of the defined seat type.
     */
    selected?: SeatIndex[];
}

export { SeatType };
