import Base from 'components/Base';
import Store from 'store';
import { SeatIndex } from 'types/seat-index';
import { SeatChangeEvent } from 'types/events';

class Seat extends Base<HTMLDivElement> {
  private store: Store;
  private index: SeatIndex;

  public constructor(index: SeatIndex, store: Store) {
    const seat = document.createElement('div');
    super(seat);

    this.store = store;
    this.index = index;

    this.seatClick = this.seatClick.bind(this);
    seat.addEventListener('click', this.seatClick);

    this.stateEventListener = this.stateEventListener.bind(this);
    this.store.addEventListener('seatchange', this.stateEventListener, {
      index,
    });
  }

  private stateEventListener(e: SeatChangeEvent) {
    const { index, state, label, type } = e.current;
    const typeOptions = this.store.getTypeOptions(type);

    if (this.index.row === index.row && this.index.col === index.col) {
      this.element.textContent = label;
      this.element.className = `sc-seat sc-seat-${state} ${typeOptions.cssClass}`;
    }
  }

  private seatClick() {
    const seat = this.store.getSeat(this.index);
    if (seat.state !== 'reserved' && seat.state !== 'disabled') {
      const newState = seat.state === 'selected' ? 'available' : 'selected';
      this.store.setSeat(seat.index, { state: newState }, true);
    }
  }
}

export default Seat;
