import { SeatState } from 'types/seat-state';
import { SeatIndex } from 'types/seat-index';
import { SeatType } from 'types/seat-type';

interface SeatInfo {
  index: SeatIndex;
  name: string;
  type: {
    key: string;
    options: SeatType;
  };
  state: SeatState;
}

export { SeatInfo };
