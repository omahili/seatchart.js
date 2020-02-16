import BaseUI from 'components/base';

/**
 * @internal
 */
class SeatUI extends BaseUI<HTMLDivElement> {
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

export default SeatUI;
