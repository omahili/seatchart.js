import Base from 'components/Base';

class MapFrontIndicator extends Base<HTMLDivElement> {
  public constructor() {
    const front = document.createElement('div');
    front.textContent = 'Front';
    front.className = 'sc-front';

    super(front);
  }
}

export default MapFrontIndicator;
