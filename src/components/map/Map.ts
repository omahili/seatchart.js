import Seat from 'components/map/Seat';
import FrontIndicator from 'components/map/FrontIndicator';
import MapIndexer from 'components/map/MapIndexer';
import Spacer from 'components/map/Spacer';
import Store from 'store';
import Base from 'components/Base';

class Map extends Base<HTMLDivElement> {
  public constructor(store: Store) {
    const options = store.getOptions();
    const { rows, columns, rowSpacers, columnSpacers, indexers, frontVisible } =
      options.map;

    const map = document.createElement('div');
    map.classList.add('sc-seats-container');

    for (let i = 0; i < rows; i += 1) {
      const row = document.createElement('div');
      row.className = 'sc-seat-row';

      if (rowSpacers?.find((x) => x === i)) {
        const rowSpacer = new Spacer();
        map.appendChild(rowSpacer.element);
      }

      for (let j = 0; j < columns; j += 1) {
        if (columnSpacers?.find((x) => x === j)) {
          const spacer = new Spacer();
          row.appendChild(spacer.element);
        }

        const index = { row: i, col: j };
        const seat = new Seat(index, store);

        row.appendChild(seat.element);
      }

      map.appendChild(row);
    }

    const innerContainer = document.createElement('div');
    innerContainer.className = 'sc-map-inner-container';
    if (frontVisible === undefined || frontVisible) {
      const frontHeader = new FrontIndicator();
      innerContainer.appendChild(frontHeader.element);
    }

    if (
      !indexers?.columns ||
      indexers.columns.visible === undefined ||
      indexers.columns.visible
    ) {
      const columnIndexer = new MapIndexer('column', store);
      innerContainer.appendChild(columnIndexer.element);
    }

    innerContainer.appendChild(map);

    const mapContainer = document.createElement('div');
    mapContainer.className = 'sc-map';

    if (
      !indexers?.rows ||
      indexers.rows.visible === undefined ||
      indexers.rows.visible
    ) {
      const rowIndexer = new MapIndexer('row', store);
      mapContainer.appendChild(rowIndexer.element);
    }

    mapContainer.appendChild(innerContainer);

    super(mapContainer);
  }
}

export default Map;
