import { SeatIndex } from 'types/seat-index';

interface SeatTypeDefault {
  /**
   * Name of seat type.
   */
  name: string;
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
   * Name of seat type.
   */
  name: string;
  /**
   * Background color of the defined seat type.
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
