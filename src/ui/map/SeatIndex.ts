import BaseUI from 'ui/base/Base';

/**
 * @internal
 */
class SeatIndexUI extends BaseUI<HTMLDivElement> {
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

export default SeatIndexUI;
