import BaseUI from 'ui/base/Base';

/**
 * @internal
 */
class MapFrontHeaderUI extends BaseUI<HTMLDivElement> {
    /**
     * Creates the header of the seatmap containing the front indicator.
     */
    public constructor() {
        // set the perfect width of the front indicator
        const front = document.createElement('div');
        front.textContent = 'Front';
        front.className = 'sc-front';

        super(front);
    }
}

export default MapFrontHeaderUI;
