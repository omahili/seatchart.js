import Base from 'components/Base';

class MapFrontIndicator extends Base<HTMLDivElement> {
  public constructor(frontLabel: string) {
    const front = document.createElement('div');
    front.textContent = frontLabel;
    front.className = 'sc-front';

    super(front);
  }
}

export default MapFrontIndicator;
