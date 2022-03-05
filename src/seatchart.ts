import SeatchartUI from 'components/Seatchart';
import Store from 'store';
import { SeatIndex } from 'types/seat-index';
import { Options } from 'types/options';
import { Events } from 'types/events';
import { SeatState } from 'types/seat-state';
import { SeatInfo } from 'types/seat-info';

class Seatchart {
  /**
   * Element passed on creation to contain the Seatchart.
   */
  public readonly element: HTMLElement;
  /**
   * Options passed on creation to configure the Seatchart.
   */
  public readonly options: Options;

  private ui: SeatchartUI;
  private store: Store;

  /**
   * Creates a seatchart.
   * @param element - Html element that will contain the Seatchart.
   * @param options - Seatchart options.
   */
  public constructor(element: HTMLElement, options: Options) {
    this.element = element;
    this.options = options;
    this.store = new Store(options);
    this.ui = new SeatchartUI(element, this.store);
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
   * Gets a reference to the seat info.
   * @param index - Seat index.
   * @returns Seat info.
   */
  public getSeat(index: SeatIndex): SeatInfo {
    return this.store.getSeat(index);
  }

  /**
   * Sets seat data.
   * @param index - Index of the seat to update.
   * @param seat - An object containing the seat data.
   */
  public setSeat(
    index: SeatIndex,
    seat: Partial<{ label: string; state: SeatState; type: string }>
  ): void {
    this.store.setSeat(index, seat, true);
  }

  /**
   * Gets a reference to the cart array.
   * @returns An array containing selected seats.
   */
  public getCart(): SeatInfo[] {
    return this.store.getCart();
  }

  /**
   * Gets the total price of the selected seats.
   * @returns The total price.
   */
  public getCartTotal(): number {
    return this.store.getCartTotal();
  }

  /**
   * Unselects all seats and removes them from the cart.
   * @returns The total price.
   */
  public clearCart(): void {
    this.store.clearCart(true);
  }
}

export * from 'types/events';
export * from 'types/options';
export * from 'types/seat-index';
export * from 'types/seat-info';
export * from 'types/seat-state';
export * from 'types/seat-type';
export default Seatchart;
