import BaseComponent from 'components/base';

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
