import BaseUI from 'components/base';

/**
 * @internal
 */
class SeatUI extends BaseUI<HTMLDivElement> {
    /**
     * Creates a new seat.
     * @param type - The type of the seat.
     * @param content - The name representing the seat.
     * @param seatId - The dom id of the seat in the seatmap.
     * @param seatClick - Function called on seat click.
     * @param deleteClick - Function called on seat right click.
     */
    public constructor(
        type: string,
        content?: string,
        seatId?: string,
        seatClick?: (seat: HTMLElement) => any,
        rightClick?: (seat: HTMLElement) => any
    ) {
        const seat = document.createElement('div');
        seat.className = 'sc-seat ' + type;
        if (content) {
            seat.textContent = content;
        }

        // if seatId wasn't passed as argument then don't set it
        if (type !== 'blank' && seatId !== undefined) {
            seat.setAttribute('id', seatId);

            // add click event just if it's a real seats (when it has and id)
            if (seatClick) {
                seat.addEventListener('click', seatClick(seat));
            }

            if (rightClick) {
                seat.addEventListener('contextmenu', rightClick(seat), false);
            }
        }

        super(seat);
    }
}

export default SeatUI;
