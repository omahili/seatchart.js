import { SeatIndex } from 'types/seat-index';

interface SeatTypeDefault {
  /**
   * Display label of this type.
   */
  label: string;
  /**
   * Price of the seats.
   */
  price: number;
  /**
   * Css class applied to the seats of this type.
   */
  cssClass: string;
}

/**
 * Seat type options.
 */
interface SeatType {
  /**
   * Display label of this type.
   */
  label: string;
  /**
   * Price of the seats.
   */
  price: number;
  /**
   * Css class applied to the seats of this type.
   */
  cssClass: string;
  /**
   * Seats marked with this type.
   */
  seats?: SeatIndex[];
  /**
   * Rows of the seats marked with this type.
   */
  seatRows?: number[];
  /**
   * Columns of the seats marked with this type.
   */
  seatColumns?: number[];
}

export { SeatTypeDefault, SeatType };
