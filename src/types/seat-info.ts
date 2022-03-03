import { SeatState } from 'types/seat-state';
import { SeatIndex } from 'types/seat-index';

/**
 * An object containing information about a seat.
 */
interface SeatInfo {
  /**
   * Seat index.
   */
  index: SeatIndex;
  /**
   * Seat display label.
   */
  label: string;
  /**
   * Seat type.
   */
  type: string;
  /**
   * Seat state.
   */
  state: SeatState;
}

export { SeatInfo };
