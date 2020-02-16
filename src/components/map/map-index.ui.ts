import BaseUI from 'components/base';
import IndexNameCallback from 'types/index-name-callback';
import SeatUI from 'components/map/seat.ui';
import MapSeatIndexUI from 'components/map/seat-index.ui';

/**
 * @internal
 */
class MapIndexUI extends BaseUI<HTMLDivElement> {
    /**
     * Creates a row containing all the column indexes.
     * @param type - Index type.
     * @param length - Number of indexes.
     * @param disabled - Disabled indexes.
     * @param name - Name generator.
     */
    public constructor(
        type: string,
        length: number,
        disabled: number[] | undefined,
        name: IndexNameCallback,
    ) {
        const mapIndex = document.createElement('div');
        mapIndex.className = `sc-${type}-index`;

        let disabledCount = 0;

        for (let i = 0; i < length; i += 1) {
            const isColumnDisabled = disabled?.includes(i) || false;
            disabledCount = isColumnDisabled ? disabledCount + 1 : disabledCount;

            const indexName = name(i, isColumnDisabled, disabledCount);
            if (indexName) {
                const index = new MapSeatIndexUI(indexName);
                mapIndex.appendChild(index.element);
            } else {
                const blank = new SeatUI('blank');
                mapIndex.appendChild(blank.element);
            }
        }

        super(mapIndex);
    }
}

export default MapIndexUI;
