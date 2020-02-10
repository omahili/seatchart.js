import SeatType from './seat-type';

/**
 * Callback to generate a seat name.
 * @returns Seat name. Return null or undefined if empty.
 */
export type SeatNameCallback = (
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

/**
 * Callback to generate a row or column name.
 * @returns Row or column name. Return null or undefined if empty.
 */
export type IndexNameCallback = (
    /**
     * Row or column index (starts from 0).
     */
    index: number,
    /**
     * True if current row or column is disabled.
     */
    disabled: boolean,
    /**
     * Number of disabled rows or columns till current one (including current one if disabled)
     */
    disabledCount: number,
) => string | undefined;

/**
 * Options to configure a Seatchart.
 */
interface Options {
    /**
     * Map options.
     */
    map: {
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
    };
    /**
     * Seat types options.
     */
    types: Array<SeatType>;
    /**
     * Cart options.
     */
    cart?: {
        /**
         * Container id.
         */
        id: string;
        /**
         * Cart height.
         */
        height?: string;
        /**
         * Cart width.
         */
        width?: string;
        /**
         * Current currency.
         */
        currency?: string;
    };
    /**
     * Legend options.
     */
    legend?: {
        /**
         * Container id.
         */
        id: string;
    };
    /**
     *  Assets options.
     */
    assets?: {
        /**
         * Path to assets.
         */
        path?: string;
    };
}

export default Options;
