import { Events, Options, SeatInfo, SeatState, SeatChangeEvent } from 'index';
import { SeatIndex } from 'types/seat-index';

type SeatchartEventListener<T extends keyof Events> = (e: Events[T]) => void;

class Store {
  private readonly options: Options;
  private cart: SeatInfo[] = [];
  private seats: SeatInfo[][] = [];

  private eventListeners: {
    [K in keyof Events]: ((e: Events[K]) => void)[];
  };
  private singleSeatChangeEventListeners: {
    [key: string]: ((e: SeatChangeEvent) => void)[];
  } = {};

  constructor(options: Options) {
    this.options = options;

    this.getColumnLabel = this.getColumnLabel.bind(this);
    this.getRowLabel = this.getRowLabel.bind(this);

    this.eventListeners = {
      cartchange: [],
      cartclear: [],
      seatchange: [],
      submit: [],
    };

    const { rows, columns } = options.map;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const listenerKey = this.listenerKey({ row: i, col: j });
        this.singleSeatChangeEventListeners[listenerKey] = [];
      }
    }
  }

  public init() {
    const {
      rows: totalRows,
      columns: totalColumns,
      disabledSeats,
      reservedSeats,
      selectedSeats,
    } = this.options.map;

    // init seats
    for (let row = 0; row < totalRows; row++) {
      this.seats[row] = [];

      for (let col = 0; col < totalColumns; col++) {
        const index = { row, col };
        const previous = { ...this.seats[row][col] };

        let state: SeatState = 'available';
        if (disabledSeats?.some(this.isSameSeat(index))) {
          state = 'disabled';
        } else if (reservedSeats?.some(this.isSameSeat(index))) {
          state = 'reserved';
        } else if (selectedSeats?.some(this.isSameSeat(index))) {
          state = 'selected';
        }

        const label = this.getSeatLabel(index);
        const type = this.getSeatType(index);

        this.seats[row][col] = {
          index,
          label,
          state,
          type,
        };

        const current = this.seats[row][col];

        const listenerKey = this.listenerKey(index);
        this.singleSeatChangeEventListeners[listenerKey].forEach((el) =>
          el({ previous, current })
        );

        this.eventListeners.seatchange.forEach((el) =>
          el({ previous, current })
        );
      }
    }

    // init cart
    if (selectedSeats) {
      for (const seatIndex of selectedSeats) {
        const seat = this.seats[seatIndex.row][seatIndex.col];
        this.cart.push(seat);

        this.eventListeners.cartchange.forEach((el) =>
          el({ action: 'add', seat })
        );
      }
    }
  }

  public getOptions() {
    return this.options;
  }

  public getTypeOptions(type: string) {
    return this.options.map.seatTypes[type];
  }

  public setSeat(
    index: SeatIndex,
    info: Partial<{ label: string; state: SeatState; type: string }>,
    emit: boolean
  ) {
    const { row, col } = index;
    const { type: newType, state: newState, label: newLabel } = info;
    const seat = this.seats[row][col];
    let hasChanged = false;
    const previous = { ...seat };

    if (newLabel && seat.label !== newLabel) {
      seat.label = newLabel;
      hasChanged = true;
    }

    if (newType && seat.type !== newType) {
      seat.type = newType;
      hasChanged = true;
    }

    if (newState && seat.state !== newState) {
      if (newState === 'selected') {
        this.addToCart(seat.type, seat.index, emit);
      } else if (seat.state === 'selected') {
        this.removeFromCart(seat.type, seat.index, emit);
      }

      seat.state = newState;
      hasChanged = true;
    }

    if (hasChanged && emit) {
      const listenerKey = this.listenerKey(index);
      this.singleSeatChangeEventListeners[listenerKey].forEach((el) =>
        el({ previous, current: seat })
      );

      this.eventListeners.seatchange.forEach((el) =>
        el({ previous, current: seat })
      );
    }
  }

  public getSeat(index: SeatIndex) {
    return this.seats[index.row][index.col];
  }

  public clearCart(emit: boolean) {
    const seats: SeatInfo[] = [...this.cart];

    if (emit && seats.length > 0) {
      this.eventListeners.cartclear.forEach((el) => el({ seats }));
    }

    seats.forEach((x) => this.setSeat(x.index, { state: 'available' }, emit));
  }

  public submit() {
    const total = this.getCartTotal();
    this.eventListeners.submit.forEach((el) => el({ cart: this.cart, total }));
  }

  public getCart() {
    return this.cart;
  }

  public getCartTotal(): number {
    const seatTypes = this.options.map.seatTypes;

    let total = 0;
    for (const seat of this.cart) {
      total += seatTypes[seat.type].price;
    }

    return total;
  }

  public countCartItems(): number {
    return this.cart.length;
  }

  public getRowLabel(row: number) {
    const label = this.options.map.indexerRows?.label;
    if (label) {
      return label(row);
    }

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const times = Math.floor(row / alphabet.length);
    const index = row - alphabet.length * times;

    return alphabet[index].repeat(times + 1);
  }

  public getColumnLabel(column: number) {
    const label = this.options.map.indexerColumns?.label;
    if (label) {
      return label(column);
    }

    return (column + 1).toString();
  }

  public addEventListener(
    type: 'seatchange',
    listener: (e: Events['seatchange']) => void,
    options: { index: SeatIndex }
  ): void;
  public addEventListener<T extends keyof Events>(
    type: T,
    listener: SeatchartEventListener<T>
  ): void;
  public addEventListener<T extends keyof Events>(
    type: T,
    listener: SeatchartEventListener<T>,
    options?: { index: SeatIndex }
  ): void {
    if (options) {
      const listenerKey = this.listenerKey(options.index);
      this.singleSeatChangeEventListeners[listenerKey].push(
        listener as (e: SeatChangeEvent) => void
      );
    } else {
      (this.eventListeners[type] as SeatchartEventListener<T>[]).push(listener);
    }
  }

  public removeEventListener(
    type: 'seatchange',
    listener: (e: Events['seatchange']) => void,
    options: { index: SeatIndex }
  ): void;
  public removeEventListener<T extends keyof Events>(
    type: T,
    listener: SeatchartEventListener<T>
  ): void;
  public removeEventListener<T extends keyof Events>(
    type: T,
    listener: SeatchartEventListener<T>,
    options?: { index: SeatIndex }
  ): void {
    if (options) {
      const listenerKey = this.listenerKey(options.index);
      this.singleSeatChangeEventListeners[listenerKey] =
        this.singleSeatChangeEventListeners[listenerKey].filter(
          (x) => x !== listener
        );
    } else {
      (this.eventListeners[type] as SeatchartEventListener<T>[]) = (
        this.eventListeners[type] as SeatchartEventListener<T>[]
      ).filter((x) => x !== listener);
    }
  }

  private listenerKey(index: SeatIndex) {
    return `${index.row}_${index.col}`;
  }

  private isSameSeat(index: SeatIndex) {
    return (otherIndex: SeatIndex) =>
      index.row === otherIndex.row && index.col === otherIndex.col;
  }

  private addToCart(type: string, index: SeatIndex, emit: boolean) {
    this.cart.push(this.seats[index.row][index.col]);

    if (emit) {
      const seat = this.getSeat(index);
      this.eventListeners.cartchange.forEach((el) =>
        el({ action: 'add', seat })
      );
    }
  }

  private removeFromCart(type: string, seatIndex: SeatIndex, emit: boolean) {
    const index = this.cart.findIndex(
      (x) => seatIndex.row === x.index.row && seatIndex.col === x.index.col
    );
    if (index >= 0) {
      this.cart.splice(index, 1);

      if (emit) {
        const seat = this.getSeat(seatIndex);
        this.eventListeners.cartchange.forEach((el) =>
          el({ action: 'remove', seat })
        );
      }
    }
  }

  private getSeatType(index: SeatIndex) {
    const seatTypes = this.options.map.seatTypes;
    const types = Object.keys(seatTypes);

    for (const key of types) {
      const options = seatTypes[key];
      if (
        options.seats?.some(this.isSameSeat(index)) ||
        options.seatColumns?.some((col) => col === index.col) ||
        options.seatRows?.some((row) => row === index.row)
      ) {
        return key;
      }
    }

    return 'default';
  }

  private getSeatLabel(index: SeatIndex) {
    const seatLabel = this.options.map.seatLabel;
    if (seatLabel) {
      return seatLabel(index);
    }

    const rowIndex = this.getRowLabel(index.row);
    const columnIndex = this.getColumnLabel(index.col);

    return `${rowIndex}${columnIndex}`;
  }
}

export default Store;
