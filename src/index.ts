import Map from 'components/map';
import SeatInfo from 'types/seat-info';
import Options from 'types/options';
import { EventListener } from 'types/events';

class Seatchart {
    public readonly options: Options;

    private map: Map;

    /**
     * Creates a seatchart.
     * @param options - Seatmap options.
     */
    public constructor(options: Options) {
        this.options = options;

        this.map = new Map(options);
    }

    /**
     * Adds an event listener.
     * @param type - Event type.
     * @param listener - Function called when the given event occurs.
     */
    public addEventListener(type: 'clear' | 'change', listener: EventListener): void {
        this.map.addEventListener(type, listener);
    }

    /**
     * Removes an event listener.
     * @param type - Event type.
     * @param listener - Listener to remove.
     */
    public removeEventListener(type: 'clear' | 'change', listener: EventListener): void {
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
     * Gets all seats which represent a gap of the seat map.
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
     * Gets the name of a seat.
     * @param id - The dom id of the seat in the seatmap.
     * @returns The name.
     */
    public getSeatName(id: string): string {
        return this.map.getSeatName(id);
    }

    /**
     * Gets the type of a seat.
     * @param id - The dom id of the seat in the seatmap.
     * @returns The type.
     */
    public getSeatType(id: string): string {
        return this.map.getSeatType(id);
    }

    /**
     * Makes a seat available,
     * @param id - The dom id of the seat in the seatmap.
     */
    public releaseSeat(id: string): void {
        this.map.releaseSeat(id);
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

    /**
     * Gets the price for a specific type of seat.
     * @param type - The type of the seat.
     * @returns Price.
     */
    public getSeatPrice(type: string): number {
        return this.map.cart.getSeatPrice(type);
    }
}

export default Seatchart;
