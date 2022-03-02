import { SeatTypeDefault, SeatType } from 'types/seat-type';
import { SeatIndex } from 'types/seat-index';

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
     * Seat types options.
     */
    seatTypes: {
      /**
       * All seats that do not fall into a type will be marked as `default`.
       */
      default: SeatTypeDefault;
      [seatTypeKey: string]: SeatType;
    };
    /**
     * Selected seats.
     */
    selectedSeats?: SeatIndex[];
    /**
     * Reserved seats.
     */
    reservedSeats?: SeatIndex[];
    /**
     * Disabled seats options.
     */
    disabledSeats?: SeatIndex[];
    /**
     * Position where to place a space between columns. For example index 4 will place a space between columns with index 4 and 5.
     */
    columnSpacers?: number[];
    /**
     * Position where to place a space between rows. For example index 4 will place a space between rows with index 4 and 5.
     */
    rowSpacers?: number[];
    /**
     * Seat name generator.
     */
    seatName?: (index: SeatIndex) => string;
    /**
     * Indexers options.
     */
    indexers?: {
      /**
       * Row indexer options.
       */
      rows?: {
        /**
         * Row indexer visibility.
         */
        visible?: boolean;
        /**
         * Row name generator.
         */
        name?: (row: number) => string;
      };
      /**
       * Column indexer options.
       */
      columns?: {
        /**
         * Column indexer visibility.
         */
        visible?: boolean;
        /**
         * Column name generator.
         */
        name?: (column: number) => string;
      };
    };
    /**
     * Front header visibility.
     */
    frontVisible?: boolean;
  };
  /**
   * Cart options.
   */
  cart?: {
    /**
     * Container id.
     */
    id: string;
    /**
     * Current currency.
     */
    currency?: string;
  };
  /**
   * Legend container id.
   */
  legendId?: string;
  /**
   * Path to assets.
   */
  assetsSrc?: string;
}

export { Options };
