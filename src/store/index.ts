import { Events, Options, SeatInfo, SeatState, SeatChangeEvent } from 'index';
import { SeatIndex } from 'types/seat-index';

type SeatchartEventListener<T extends keyof Events> = (e: Events[T]) => void;

class Store {
  private readonly options: Options;
  private cart: { [key: string]: SeatIndex[] } = {};
  private seats: SeatInfo[][] = [];

  private eventListeners: {
    [K in keyof Events]: ((e: Events[K]) => void)[];
  };
  private singleSeatChangeEventListeners: {
    [key: string]: ((e: SeatChangeEvent) => void)[];
  } = {};

  constructor(options: Options) {
    this.options = options;

    this.getColumnName = this.getColumnName.bind(this);
    this.getRowName = this.getRowName.bind(this);

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
      seatTypes,
      disabledSeats,
      reservedSeats,
      selectedSeats,
    } = this.options.map;

    // init seats
    for (let row = 0; row < totalRows; row++) {
      this.seats[row] = [];

      for (let col = 0; col < totalColumns; col++) {
        const index = { row, col };

        let state: SeatState = 'available';
        if (disabledSeats?.some(this.isSameSeat(index))) {
          state = 'disabled';
        } else if (reservedSeats?.some(this.isSameSeat(index))) {
          state = 'reserved';
        } else if (selectedSeats?.some(this.isSameSeat(index))) {
          state = 'selected';
        }

        const name = this.getSeatName(index);
        const type = this.getSeatType(index);

        this.seats[row][col] = {
          index,
          name,
          state,
          type,
        };

        const listenerKey = this.listenerKey(index);
        this.singleSeatChangeEventListeners[listenerKey].forEach((el) =>
          el({ seat: this.seats[row][col] })
        );

        this.eventListeners.seatchange.forEach((el) =>
          el({ seat: this.seats[row][col] })
        );
      }
    }

    // init cart
    const types = Object.keys(seatTypes);
    for (const type of types) {
      this.cart[type] = [];
    }

    if (selectedSeats) {
      for (const seatIndex of selectedSeats) {
        const seat = this.seats[seatIndex.row][seatIndex.col];
        this.cart[seat.type].push(seat.index);

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
    info: Partial<{ state: SeatState; type: string }>,
    emit: boolean
  ) {
    const { row, col } = index;
    const { type: newType, state: newState } = info;
    const seat = this.seats[row][col];

    if (
      (newType && seat.type !== newType) ||
      (newState && seat.state !== newState)
    ) {
      if (newType) {
        seat.type = newType;
      }

      if (newState) {
        if (newState === 'selected') {
          this.addToCart(seat.type, seat.index, emit);
        } else if (seat.state === 'selected') {
          this.removeFromCart(seat.type, seat.index, emit);
        }

        seat.state = newState;
      }

      if (emit) {
        const listenerKey = this.listenerKey(index);
        this.singleSeatChangeEventListeners[listenerKey].forEach((el) =>
          el({ seat })
        );

        this.eventListeners.seatchange.forEach((el) => el({ seat }));
      }
    }
  }

  public getSeat(index: SeatIndex) {
    return this.seats[index.row][index.col];
  }

  public clearCart(emit = true) {
    const seats: SeatInfo[] = [];

    const types = Object.keys(this.cart);
    for (const type of types) {
      for (const seatIndex of this.cart[type]) {
        seats.push(this.getSeat(seatIndex));
      }

      this.cart[type] = [];
    }

    seats.forEach((x) => this.setSeat(x.index, { state: 'available' }, emit));

    if (emit) {
      this.eventListeners.cartclear.forEach((el) => el({ seats }));
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
    let total = 0;

    const types = Object.keys(this.cart);
    for (const type of types) {
      const price = this.options.map.seatTypes[type].price;
      total += this.cart[type].length * price;
    }

    return total;
  }

  public countCartItems(): number {
    let count = 0;

    const types = Object.keys(this.cart);
    for (const type of types) {
      count += this.cart[type].length;
    }

    return count;
  }

  public getRowName(row: number) {
    const name = this.options.map.indexers?.rows?.name;
    if (name) {
      return name(row);
    }

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const times = Math.floor(row / alphabet.length);
    const index = row - alphabet.length * times;

    return alphabet[index].repeat(times + 1);
  }

  public getColumnName(column: number) {
    const name = this.options.map.indexers?.columns?.name;
    if (name) {
      return name(column);
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
    this.cart[type].push(index);

    if (emit) {
      const seat = this.getSeat(index);
      this.eventListeners.cartchange.forEach((el) =>
        el({ action: 'add', seat })
      );
    }
  }

  private removeFromCart(type: string, seatIndex: SeatIndex, emit: boolean) {
    const index = this.cart[type].findIndex(this.isSameSeat(seatIndex));
    if (index >= 0) {
      this.cart[type].splice(index, 1);

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

  private getSeatName(index: SeatIndex) {
    const seatName = this.options.map.seatName;
    if (seatName) {
      return seatName(index);
    }

    const rowIndex = this.getRowName(index.row);
    const columnIndex = this.getColumnName(index.col);

    return `${rowIndex}${columnIndex}`;
  }
}

export default Store;
