import { Events, SeatChangeEvent } from 'types/events';
import { Options } from 'types/options';
import { SeatIndex } from 'types/seat-index';
import { SeatInfo } from 'types/seat-info';
import { SeatState } from 'types/seat-state';

type SeatchartEventListener<T extends keyof Events> = (e: Events[T]) => void;

type SetSeatParam = { label: string; state: SeatState; type: string };

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

  public setSeat(index: SeatIndex, info: Partial<SetSeatParam>, emit: boolean) {
    this.validateIndex(index);
    this.validateType(info.type);

    const { row, col } = index;
    const previous = { ...this.seats[row][col] };

    this.seats[row][col] = {
      ...previous,
      ...info,
    };

    const seat = this.seats[row][col];

    if (previous.state !== info.state) {
      if (seat.state === 'selected') {
        this.addToCart(seat.index, emit);
      } else if (previous.state === 'selected') {
        this.removeFromCart(seat.index, emit);
      }
    }

    const hasChanged = (Object.keys(info) as (keyof SetSeatParam)[]).some(
      (x) => info[x] && previous[x] !== info[x]
    );

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
    this.validateIndex(index);

    return this.seats[index.row][index.col];
  }

  public clearCart(emit: boolean) {
    const seats: SeatInfo[] = [...this.cart];

    this.cart = [];
    for (const seat of seats) {
      seat.state = 'available';
    }

    if (emit) {
      if (seats.length > 0) {
        this.eventListeners.cartclear.forEach((el) => el({ seats }));
      }

      for (const seat of seats) {
        this.eventListeners.cartchange.forEach((el) =>
          el({ action: 'remove', seat })
        );

        const previous: SeatInfo = { ...seat, state: 'selected' };
        const listenerKey = this.listenerKey(seat.index);
        this.singleSeatChangeEventListeners[listenerKey].forEach((el) =>
          el({ previous, current: seat })
        );

        this.eventListeners.seatchange.forEach((el) =>
          el({ previous, current: seat })
        );
      }
    }
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

  private validateIndex(index: SeatIndex) {
    if (
      index.row < 0 ||
      index.col < 0 ||
      index.row >= this.options.map.rows ||
      index.col >= this.options.map.columns
    ) {
      throw RangeError('Seat index is out of range');
    }
  }

  private validateType(type?: string) {
    if (type !== undefined && !this.options.map.seatTypes[type]) {
      throw TypeError(`Seat type does not exist`);
    }
  }

  private listenerKey(index: SeatIndex) {
    return `${index.row}_${index.col}`;
  }

  private isSameSeat(index: SeatIndex) {
    return (otherIndex: SeatIndex) =>
      index.row === otherIndex.row && index.col === otherIndex.col;
  }

  private addToCart(index: SeatIndex, emit: boolean) {
    this.cart.push(this.seats[index.row][index.col]);

    if (emit) {
      const seat = this.getSeat(index);
      this.eventListeners.cartchange.forEach((el) =>
        el({ action: 'add', seat })
      );
    }
  }

  private removeFromCart(seatIndex: SeatIndex, emit: boolean) {
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
