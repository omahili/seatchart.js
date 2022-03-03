import Base from 'components/Base';
import SeatIndexer from 'components/map/SeatIndexer';
import Spacer from 'components/map/Spacer';
import Store from 'store';

class MapIndexer extends Base<HTMLDivElement> {
  public constructor(type: 'row' | 'column', store: Store) {
    const mapIndexer = document.createElement('div');
    mapIndexer.className = `sc-indexer sc-indexer-${type}`;

    const { map } = store.getOptions();
    const spacers = type === 'row' ? map.rowSpacers : map.columnSpacers;
    const length = type === 'row' ? map.rows : map.columns;
    const getIndexerName =
      type === 'row' ? store.getRowName : store.getColumnName;

    for (let i = 0; i < length; i += 1) {
      const indexerName = getIndexerName(i);
      const indexer = new SeatIndexer(indexerName);

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
