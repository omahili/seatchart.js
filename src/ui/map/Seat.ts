import BaseUI from 'ui/base/Base';

/**
 * @internal
 */
class SeatUI extends BaseUI<HTMLDivElement> {
    /**
     * Creates a new seat.
     * @param type - The type of the seat.
     * @param content - The name representing the seat.
     * @param row - Seat row.
     * @param seatId - Seat column.
     * @param seatClick - Function called on seat click.
     * @param deleteClick - Function called on seat right click.
     */
    public constructor(
        type: string,
        content?: string,
        row?: number,
        col?: number,
        seatClick?: (e: MouseEvent) => void,
        seatRightClick?: (e: Event) => void
    ) {
        const seat = document.createElement('div');
        seat.className = 'sc-seat ' + type;
        if (content) {
            seat.textContent = content;
        }

        if (type !== 'blank' && col !== undefined && row !== undefined) {
            const seatId = SeatUI.id(row, col);
            seat.setAttribute('id', seatId);

            if (seatClick) {
                seat.addEventListener('click', seatClick);
            }

            if (seatRightClick) {
                seat.addEventListener('contextmenu', seatRightClick, false);
            }
        }

        super(seat);
    }

    /**
     * Creates seat id from an index.
     * @param row - Row of the seat.
     * @param column - Column of the seat.
     * @returns Seat id.
     */
    static id(row: number, column: number) {
        return `${row}_${column}`;
    }
}

export default SeatUI;
