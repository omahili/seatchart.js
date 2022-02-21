import MapUI from 'ui/map/Map';
import { SeatInfo } from 'types/seat-info';
import { Options } from 'types/options';
import { EventMap } from 'types/events';

export * from 'types/cart-options';
export * from 'types/events';
export * from 'types/map-options';
export * from 'types/options';
export * from 'types/seat-info';
export * from 'types/seat-type';

class Seatchart {
    public readonly options: Options;

    private map: MapUI;

    /**
     * Creates a seatchart.
     * @param options - Seatmap options.
     */
    public constructor(options: Options) {
        this.options = options;

        this.map = new MapUI(options);
    }

    /**
     * Adds an event listener.
     * @param type - Event type.
     * @param listener - Function called when the given event occurs.
     */
    public addEventListener<T extends keyof EventMap>(type: T, listener: (e: EventMap[T]) => void): void {
        this.map.addEventListener(type, listener);
    }

    /**
     * Removes an event listener.
     * @param type - Event type.
     * @param listener - Listener to remove.
     */
    public removeEventListener<T extends keyof EventMap>(type: T, listener: (e: EventMap[T]) => void): void {
        this.map.removeEventListener(type, listener);
    }

    /**
     * Checks whether a seat is a gap or not.
     * @param seatIndex - Seat index.
     * @returns True if it is, false otherwise.
     */
    public isGap(seatIndex: number): boolean {
        return this.map.isGap(seatIndex);
    }

    /**
     * Checks whether a seat creates a gap or not.
     * @param seatIndex - Seat index.
     * @returns True if it does, false otherwise.
     */
    public makesGap(seatIndex: number): boolean {
        return this.map.makesGap(seatIndex);
    }

    /**
     * Gets all seats which represent a gap in the seat map.
     * @returns Array of indexes.
     */
    public getGaps(): number[] {
        return this.map.getGaps();
    }

    /**
     * Gets seat info.
     * @param index - Seat index.
     * @returns Seat info.
     */
    public getSeat(index: number): SeatInfo {
        return this.map.get(index);
    }

    /**
     * Set seat type.
     * @param index - Index of the seat to update.
     * @param type - New seat type ('disabled', 'reserved' and 'available' are supported too).
     * @param emit - True to trigger onChange event (dafualt false).
     */
    public setSeat(index: number, type: string, emit: boolean): void {
        this.map.set(index, type, emit);
    }

    /**
     * Gets a reference to the shopping cart object.
     * @returns An object containing all seats added to the shopping cart,
     * mapped by seat type.
     */
    public getCart(): { [key: string]: number[] } {
        return this.map.cart.getCart();
    }

    /**
     * Gets the total price of the selected seats.
     * @returns The total price.
     */
    public getCartTotal(): number {
        return this.map.cart.getTotal();
    }
}

export default Seatchart;
