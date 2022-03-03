import Base from 'components/Base';

class Spacer extends Base<HTMLDivElement> {
  public constructor() {
    const seat = document.createElement('div');
    seat.className = `sc-spacer`;

    super(seat);
  }
}

export default Spacer;
