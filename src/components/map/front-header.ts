import BaseComponent from 'components/base';

/**
 * @internal
 */
class FrontHeader extends BaseComponent<HTMLDivElement> {
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

export default FrontHeader;
