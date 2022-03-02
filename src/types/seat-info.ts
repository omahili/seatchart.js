import { SeatState } from 'types/seat-state';
import { SeatIndex } from 'types/seat-index';

interface SeatInfo {
  index: SeatIndex;
  name: string;
  type: string;
  state: SeatState;
}

export { SeatInfo };
