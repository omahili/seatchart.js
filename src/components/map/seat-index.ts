import BaseComponent from 'utils/base-component';

/**
 * @internal
 */
class SeatIndex extends BaseComponent<HTMLDivElement> {
    /**
     * Creates a seatmap index.
     * @param content - Text content.
     */
    public constructor(content: string) {
        const seatIndex = document.createElement('div');
        seatIndex.textContent = content;
        seatIndex.className = 'sc-index';

        super(seatIndex);
    }
}

export default SeatIndex;
