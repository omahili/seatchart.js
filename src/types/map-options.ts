import SeatNameCallback from 'types/seat-name-callback';
import IndexNameCallback from 'types/index-name-callback';

interface MapOptions {
    /**
     * Container id.
     */
    id: string;
    /**
     * Number of rows.
     */
    rows: number;
    /**
     * Number of columns.
     */
    columns: number;
    /**
     * Seat name generator.
     */
    seatName?: SeatNameCallback;
    /**
     *  Array of reserved seats.
     */
    reserved?: {
        /**
         * Array of the reserved seats.
         */
        seats?: number[];
    };
    /**
     * Disabled seats options.
     */
    disabled?: {
        /**
         * Array of the disabled seats.
         */
        seats?: number[];
        /**
         * Array of the disabled rows of seats.
         */
        rows?: number[];
        /**
         * Array of the disabled columns of seats.
         */
        columns?: number[];
    };
    /**
     * Indexes options.
     */
    indexes?: {
        /**
         * Rows index options.
         */
        rows?: {
            /**
             * Row index visibility.
             */
            visible?: boolean;
            /**
             * Row index position.
             */
            position?: 'left' | 'right';
            /**
             * Row name generator.
             */
            name?: IndexNameCallback;
        };
        /**
         * Columns index options.
         */
        columns?: {
            /**
             * Columns index visibility.
             */
            visible?: boolean;
            /**
             * Column index posiion.
             */
            position?: 'top' | 'bottom';
            /**
             * Column name generator.
             */
            name?: IndexNameCallback;
        };
    };
    /**
     * Front header options.
     */
    front?: {
        /*
         * Front header visibility.
         */
        visible?: boolean;
    };
}

export default MapOptions;
