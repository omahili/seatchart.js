import { SeatIndex } from 'types/seat-index';

interface SeatTypeDefault {
  /**
   * Display label of seat type.
   */
  label: string;
  /**
   * Price of the defined seat type.
   */
  price: number;
  /**
   * Css class of the defined seat type.
   */
  cssClass: string;
}

/**
 * Seat type options.
 */
interface SeatType {
  /**
   * Display label of the defined seat type.
   */
  label: string;
  /**
   * Price of the defined seat type.
   */
  price: number;
  /**
   * Css class of the defined seat type.
   */
  cssClass: string;
  /**
   * Seats marked as the defined seat type.
   */
  seats?: SeatIndex[];
  /**
   * Seat rows marked as the defined seat type.
   */
  seatRows?: number[];
  /**
   * Seat columns marked as the defined seat type.
   */
  seatColumns?: number[];
}

export { SeatTypeDefault, SeatType };
