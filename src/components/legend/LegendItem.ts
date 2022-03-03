import Base from 'components/Base';

class LegendItem extends Base<HTMLLIElement> {
  public constructor(content: string, cssClassBullet: string) {
    const legendItem = document.createElement('li');
    legendItem.className = 'sc-legend-item';
    const legendBullet = document.createElement('div');
    legendBullet.className = `sc-legend-bullet ${cssClassBullet}`;

    const description = document.createElement('p');
    description.className = 'sc-legend-description';
    description.textContent = content;

    legendItem.appendChild(legendBullet);
    legendItem.appendChild(description);

    super(legendItem);
  }
}

export default LegendItem;
