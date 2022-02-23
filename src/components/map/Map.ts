import Seat from 'components/map/Seat';
import FrontIndicator from 'components/map/FrontIndicator';
import MapIndexer from 'components/map/MapIndexer';
import Spacer from 'components/map/Spacer';
import Store from 'store';

class Map {
    private store: Store;

    public constructor(store: Store) {
        this.store = store;
        this.render();
    }

    private render(): void {
        const options = this.store.getOptions();
        const {
            id,
            rows,
            columns,
            rowSpacers,
            columnSpacers,
            indexers,
            front,
        } = options.map;

        const map = document.createElement('div');
        map.classList.add('sc-seats-container');

        for (let i = 0; i < rows; i += 1) {
            const row = document.createElement('div');
            row.className = 'sc-seat-row';

            if (rowSpacers?.find(x => x === i)) {
                const rowSpacer = new Spacer();
                map.appendChild(rowSpacer.element);
            }

            for (let j = 0; j < columns; j += 1) {
                if (columnSpacers?.find(x => x === j)) {
                    const spacer = new Spacer();
                    row.appendChild(spacer.element);
                }

                const index = {row: i, col: j};
                const seat = new Seat(index, this.store);

                row.appendChild(seat.element);
            }

            map.appendChild(row);
        }

        const innerContainer = document.createElement('div');
        innerContainer.className = 'sc-map-inner-container';
        if (!front || front.visible === undefined || front.visible) {
            const frontHeader = new FrontIndicator();
            innerContainer.appendChild(frontHeader.element);
        }

        if (indexers === undefined || indexers.columns?.visible === undefined || !indexers?.columns?.visible) {
            const columnIndexer = new MapIndexer('column', this.store);
            innerContainer.appendChild(columnIndexer.element);
        }

        innerContainer.appendChild(map);

        const mainContainer = document.createElement('div');
        mainContainer.className = 'sc-component sc-map';

        if (indexers === undefined || indexers.rows?.visible === undefined || !indexers?.rows?.visible) {
            const rowIndexer = new MapIndexer('row', this.store);
            mainContainer.appendChild(rowIndexer.element);
        }

        mainContainer.appendChild(innerContainer);

        const mapContainer = document.getElementById(id);
        mapContainer?.appendChild(mainContainer);
    }
}

export default Map;
