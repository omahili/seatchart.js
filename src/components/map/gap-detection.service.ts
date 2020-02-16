import InvalidParameterError from 'errors/invalid-parameter-error';
import CartUI from 'components/cart';

/**
 * @internal
 */
class GapDetectionService {
    private cart: CartUI;
    private rows: number;
    private columns: number;
    private disabledSeats: number[] | undefined;
    private disabledRows: number[] | undefined;
    private disabledColumns: number[] | undefined;
    private reservedSeats: number[] | undefined;

    /**
     * Create a service to detect gaps in the map.
     *
     * @param cart - Cart component.
     * @param rows - Number of rows in the map.
     * @param columns - Number of columns in the map.
     * @param disabledSeats - Array of disabled seats.
     * @param disabledRows - Array of disabled rows.
     * @param disabledColumns - Array of disabled columns.
     * @param reservedSeats - Array of reserved seats.
     */
    public constructor(
        cart: CartUI,
        rows: number,
        columns: number,
        disabledSeats: number[] | undefined,
        disabledRows: number[] | undefined,
        disabledColumns: number[] | undefined,
        reservedSeats: number[] | undefined,
    ) {
        this.cart = cart;
        this.rows = rows;
        this.columns = columns;
        this.disabledSeats = disabledSeats;
        this.disabledRows = disabledRows;
        this.disabledColumns = disabledColumns;
        this.reservedSeats = reservedSeats;
    }

    /**
     * Checks whether a seat is a gap or not.
     * @param seatIndex - Seat index.
     * @returns True if it is, false otherwise.
     */
    public isGap(seatIndex: number): boolean {
        if (typeof seatIndex !== 'number' && Math.floor(seatIndex) === seatIndex) {
            throw new InvalidParameterError(
                'Invalid parameter \'seatIndex\' supplied to Seatchart.isGap(). It must be an integer.'
            );
        } else if (seatIndex >= this.rows * this.columns) {
            throw new InvalidParameterError(
                'Invalid parameter \'seatIndex\' supplied to Seatchart.isGap(). Index is out of range.'
            );
        }

        const row = Math.floor(seatIndex / this.columns);
        const col = seatIndex % this.columns;

        const seatId = `${row}_${col}`;

        // if current seat is disabled or reserved do not continue
        if ((this.disabledSeats && this.disabledSeats.includes(seatIndex)) ||
            (this.disabledColumns && this.disabledColumns.includes(col)) ||
            (this.disabledRows && this.disabledRows.includes(row)) ||
            (this.reservedSeats && this.reservedSeats.includes(seatIndex))
        ) {
            return false;
        }

        const keys = Object.keys(this.cart.dict);

        // if current seat is selected do not continue
        for (const key of keys) {
            if (this.cart.dict[key].includes(seatId)) {
                return false;
            }
        }

        const colBefore = col - 1;
        const colAfter = col + 1;

        const seatBefore = seatIndex - 1;
        const seatAfter = seatIndex + 1;

        const isSeatBeforeDisabled = this.disabledRows?.includes(seatBefore) || false;
        const isSeatAfterDisabled = this.disabledRows?.includes(seatAfter) || false;

        const isSeatBeforeReserved = this.reservedSeats?.includes(seatBefore) || false;
        const isSeatAfterReserved = this.reservedSeats?.includes(seatAfter) || false;

        // if there's a disabled/reserved block before and after do not consider it a gap
        if ((isSeatBeforeDisabled && isSeatAfterDisabled) ||
            (isSeatBeforeReserved && isSeatAfterReserved) ||
            (isSeatBeforeReserved && isSeatAfterDisabled) ||
            (isSeatBeforeDisabled && isSeatAfterReserved)) {
            return false;
        }

        // if there's a disabled/reserved block before and no seats after because the seatchart ends or,
        // a disabled/reserved block after and no seats before, then do not consider it a gap
        if (((isSeatBeforeDisabled || isSeatBeforeReserved) && colAfter >= this.columns) ||
            (colBefore < 0 && (isSeatAfterDisabled || isSeatAfterReserved))) {
            return false;
        }

        const seatBeforeId = `${row}_${colBefore}`;
        const seatAfterId = `${row}_${colAfter}`;

        let isSeatBeforeSelected = false;
        let isSeatAfterSelected = false;

        // check if seat before and after are selected
        for (const type of keys) {
            if (!isSeatBeforeSelected) {
                isSeatBeforeSelected = this.cart.dict[type].includes(seatBeforeId);
            }

            if (!isSeatAfterSelected) {
                isSeatAfterSelected = this.cart.dict[type].includes(seatAfterId);
            }

            if (isSeatAfterSelected && isSeatBeforeSelected) {
                break;
            }
        }

        const isSeatBeforeUnavailable = colBefore < 0 ||
            this.reservedSeats?.includes(seatBefore) ||
            isSeatBeforeDisabled ||
            isSeatBeforeSelected;

        const isSeatAfterUnavailable = colAfter >= this.columns ||
            this.reservedSeats?.includes(seatAfter) ||
            isSeatAfterDisabled ||
            isSeatAfterSelected;

        return isSeatBeforeUnavailable && isSeatAfterUnavailable;
    }

    /**
     * Checks whether a seat creates a gap or not.
     * @param seatIndex - Seat index.
     * @returns True if it does, false otherwise.
     */
    public makesGap(seatIndex: number): boolean {
        if (typeof seatIndex !== 'number' && Math.floor(seatIndex) === seatIndex) {
            throw new InvalidParameterError('Invalid parameter \'seatIndex\' supplied to Seatchart.makesGap(). ' +
                'It must be an integer.',
            );
        } else if (seatIndex >= this.rows * this.columns) {
            throw new InvalidParameterError('Invalid parameter \'seatIndex\' supplied to Seatchart.makesGap(). ' +
                'Index is out of range.',
            );
        }

        const col = seatIndex % this.columns;

        let isSeatBeforeGap = false;
        if (seatIndex - 1 >= 0 && col > 0) {
            isSeatBeforeGap = this.isGap(seatIndex - 1);
        }

        let isSeatAfterGap = false;
        if ((seatIndex + 1 < this.columns * this.rows) &&
            (col + 1 < this.columns)) {
            isSeatAfterGap = this.isGap(seatIndex + 1);
        }

        return isSeatBeforeGap || isSeatAfterGap;
    }

    /**
     * Gets all seats which represent a gap of the seat map.
     * @returns Array of indexes.
     */
    public getGaps(): number[] {
        const gaps = [];
        const count = this.columns * this.rows;
        for (let i = 0; i < count; i += 1) {
            if (this.isGap(i)) {
                gaps.push(i);
            }
        }

        return gaps;
    }
}

export default GapDetectionService;
