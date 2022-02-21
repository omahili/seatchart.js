import BaseUI from 'ui/base/Base';

/**
 * @internal
 */
class MapRowUI extends BaseUI<HTMLDivElement> {
    /**
     * Creates a seat map row.
     */
    public constructor() {
        const row = document.createElement('div');
        row.className = 'sc-map-row';

        super(row);
    }
}

export default MapRowUI;
