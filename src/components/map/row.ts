import BaseComponent from 'utils/base-component';

/**
 * @internal
 */
class Row extends BaseComponent<HTMLDivElement> {
    /**
     * Creates a seat map row.
     */
    public constructor() {
        const row = document.createElement('div');
        row.className = 'sc-map-row';

        super(row);
    }
}

export default Row;
