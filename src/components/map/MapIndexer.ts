import Base from 'components/Base';
import SeatIndexer from 'components/map/SeatIndexer';
import Spacer from 'components/map/Spacer';
import Store from 'store';

class MapIndexer extends Base<HTMLDivElement> {
  public constructor(type: 'rows' | 'columns', store: Store) {
    const mapIndexer = document.createElement('div');
    mapIndexer.className = `sc-indexer sc-indexer-${type}`;

    const { map } = store.getOptions();
    const spacers = type === 'rows' ? map.rowSpacers : map.columnSpacers;
    const length = type === 'rows' ? map.rows : map.columns;
    const getIndexerLabel =
      type === 'rows' ? store.getRowLabel : store.getColumnLabel;

    for (let i = 0; i < length; i += 1) {
      const indexerLabel = getIndexerLabel(i);
      const indexer = new SeatIndexer(indexerLabel);

      if (spacers?.some((x) => x === i)) {
        const spacer = new Spacer();
        mapIndexer.appendChild(spacer.element);
      }

      mapIndexer.appendChild(indexer.element);
    }

    super(mapIndexer);
  }
}

export default MapIndexer;
