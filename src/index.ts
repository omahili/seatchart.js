import Map from 'components/map/Map';
import Legend from 'components/legend/Legend';
import Cart from 'components/cart/Cart';
import Store from 'store';
import { SeatIndex } from 'types/seat-index';
import { Options } from 'types/options';
import { Events } from 'types/events';
import { SeatState } from 'types/seat-state';
import { SeatInfo } from 'types/seat-info';

class Seatchart {
  public readonly options: Options;

  private store: Store;

  /**
   * Creates a seatchart.
   * @param options - Seatchart options.
   */
  public constructor(options: Options) {
    this.options = options;
    this.store = new Store(options);

    new Map(this.store);
    new Cart(this.store);
    new Legend(this.store);

    this.store.init();
  }

  /**
   * Adds an event listener.
   * @param type - Event type.
   * @param listener - Listener function called when the given event occurs.
   */
  public addEventListener<T extends keyof Events>(
    type: T,
    listener: (e: Events[T]) => void
  ): void {
    this.store.addEventListener(type, listener);
  }

  /**
   * Removes an event listener.
   * @param type - Event type.
   * @param listener - Listener to remove.
   */
  public removeEventListener<T extends keyof Events>(
    type: T,
    listener: (e: Events[T]) => void
  ): void {
    this.store.removeEventListener(type, listener);
  }

  /**
   * Gets information about a seat.
   * @param index - Seat index.
   * @returns Seat info.
   */
  public getSeat(index: SeatIndex): SeatInfo {
    return this.store.getSeat(index);
  }

  /**
   * Sets seat type and/or state.
   * @param index - Index of the seat to update.
   * @param seat - An object containing the new seat state and/or type.
   * @param emit - True to trigger seatchange event (dafualt false).
   */
  public setSeat(
    index: SeatIndex,
    seat: Partial<{ state: SeatState; type: string }>,
    emit = false
  ): void {
    this.store.setSeat(index, seat, emit);
  }

  /**
   * Gets a reference to the shopping cart object.
   * @returns An object containing all seats added to the shopping cart,
   * mapped by seat type.
   */
  public getCart(): { [key: string]: SeatIndex[] } {
    return this.store.getCart();
  }

  /**
   * Gets the total price of the selected seats.
   * @returns The total price.
   */
  public getCartTotal(): number {
    return this.store.getCartTotal();
  }
}

export * from 'types/cart-options';
export * from 'types/map-options';
export * from 'types/seat-info';
export * from 'types/seat-type';
export * from 'types/seat-state';
export * from 'types/seat-index';
export * from 'types/events';
export * from 'types/options';
export default Seatchart;
