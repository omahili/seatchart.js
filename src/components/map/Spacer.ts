import Base from 'components/base/Base';

class Spacer extends Base<HTMLDivElement> {
  public constructor() {
    const seat = document.createElement('div');
    seat.className = `sc-spacer`;

    super(seat);
  }
}

export default Spacer;
