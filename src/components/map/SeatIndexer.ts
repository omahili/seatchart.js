import Base from 'components/Base';

class SeatIndexer extends Base<HTMLDivElement> {
  public constructor(content: string) {
    const seatIndex = document.createElement('div');
    seatIndex.className = 'sc-seat-indexer';
    seatIndex.textContent = content;

    super(seatIndex);
  }
}

export default SeatIndexer;
