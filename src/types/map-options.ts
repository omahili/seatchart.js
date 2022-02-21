export interface RowColumnInfo {
    /**
     * Row or column index (starts from 0).
     */
    index: number;
    /**
     * True if current row or column is disabled.
     */
    disabled: boolean;
    /**
     * Number of disabled rows or columns until the current one (included).
     */
    disabledCount: number;
}


export interface MapOptions {
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
    seatName?: (
        /**
         * Row info object.
         */
        rowInfo: RowColumnInfo,
        /**
         * Column info object
         */
        columnInfo: RowColumnInfo,
    ) => string;
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
            name?: (rowInfo: RowColumnInfo) => string | undefined;
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
            name?: (columnInfo: RowColumnInfo) => string | undefined;
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
