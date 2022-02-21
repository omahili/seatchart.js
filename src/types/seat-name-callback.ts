/**
 * Callback to generate a seat name.
 * @returns Seat name. Returns null or undefined if empty.
 */
type SeatNameCallback = (
    /**
     * Row object.
     */
    row: {
        /**
         * Row index (starts from 0).
         */
        index: number;
        /**
         * True if current row is disabled.
         */
        disabled: boolean;
        /**
         * Number of disabled rows till current one (including current one if disabled).
         */
        disabledCount: number;
    },
    /**
     * Column object
     */
    column: {
        /**
         * Row index (starts from 0).
         */
        index: number;
        /**
         * True if current row is disabled.
         */
        disabled: boolean;
        /**
         * Number of disabled rows till current one (including current one if disabled).
         */
        disabledCount: number;
    },
) => string;

export { SeatNameCallback };
