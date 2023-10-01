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
     * Disabled seats.
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
     * Seat label generator.
     */
    seatLabel?: (index: SeatIndex) => string;
    /**
     * Row indexers options.
     */
    indexerRows?: {
      /**
       * Visibility.
       */
      visible?: boolean;
      /**
       * Label generator.
       */
      label?: (row: number) => string;
    };
    /**
     * Column indexers options.
     */
    indexerColumns?: {
      /**
       * Visibility.
       */
      visible?: boolean;
      /**
       * Label generator.
       */
      label?: (column: number) => string;
    };
    /**
     * Sets front header visibility.
     */
    frontVisible?: boolean;
    frontLabel?: string;
  };
  /**
   * Cart options.
   */
  cart?: {
    /**
     * Cart visibility.
     */
    visible?: boolean;
    /**
     * Displayed currency.
     */
    currency?: string;
    /**
     * Label displayed on the submit button.
     */
    submitLabel?: string;
    titleLabel?: string;
    totalLabel?: string;
    currencyBehind?: boolean;
    showTotal?: boolean;
  };
  /**
   * Legend visibility.
   */
  legendVisible?: boolean;
  reservedLegendLabel?: string;
  hideLegendPrice?: boolean;
}

export { Options };
