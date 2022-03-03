import Store from 'store';
import options from 'tests/options';

describe('Seats', () => {
  describe('Get seats', () => {
    let store: Store;

    beforeAll(() => {
      store = new Store(options);
      store.init();
    });

    it('should be available', () => {
      const seat = store.getSeat({ row: 0, col: 1 });

      expect(seat.index.row).toBe(0);
      expect(seat.index.col).toBe(1);
      expect(seat.label).toBe('A2');
      expect(seat.type).toBe('first');
      expect(seat.state).toBe('available');
    });

    it('should be disabled', () => {
      const seat = store.getSeat({ row: 8, col: 9 });

      expect(seat.index.row).toBe(8);
      expect(seat.index.col).toBe(9);
      expect(seat.label).toBe('I10');
      expect(seat.type).toBe('reduced');
      expect(seat.state).toBe('disabled');
    });

    it('should be reserved', () => {
      const seat = store.getSeat({ row: 4, col: 5 });

      expect(seat.index.row).toBe(4);
      expect(seat.index.col).toBe(5);
      expect(seat.label).toBe('E6');
      expect(seat.type).toBe('default');
      expect(seat.state).toBe('reserved');
    });

    it('should be selected', () => {
      const seat = store.getSeat({ row: 8, col: 4 });

      expect(seat.index.row).toBe(8);
      expect(seat.index.col).toBe(4);
      expect(seat.label).toBe('I5');
      expect(seat.type).toBe('reduced');
      expect(seat.state).toBe('selected');
    });

    describe('Clear and get seats', () => {
      beforeAll(() => {
        store.clearCart(true);
      });

      it('should be available', () => {
        const seat = store.getSeat({ row: 0, col: 5 });
        expect(seat.state).toBe('available');
      });

      it('should be available', () => {
        const seat = store.getSeat({ row: 6, col: 1 });
        expect(seat.state).toBe('available');
      });

      it('should be available', () => {
        const seat = store.getSeat({ row: 8, col: 4 });
        expect(seat.state).toBe('available');
      });
    });
  });

  describe('Set seats', () => {
    let store: Store;

    beforeAll(() => {
      store = new Store(options);
      store.init();
    });

    it('should throw a TypeError', () => {
      const getSeat = () =>
        store.setSeat({ row: 0, col: 10 }, { type: 'default' }, false);

      expect(getSeat).toThrowError(TypeError);
    });

    it('should set state', () => {
      const index = { row: 0, col: 3 };
      store.setSeat(index, { state: 'available' }, false);
      const seat = store.getSeat(index);

      expect(seat.index.row).toBe(0);
      expect(seat.index.col).toBe(3);
      expect(seat.label).toBe('A4');
      expect(seat.type).toBe('first');
      expect(seat.state).toBe('available');
    });

    it('should set label', () => {
      const index = { row: 5, col: 5 };
      store.setSeat(index, { label: 'NEW LABEL' }, false);
      const seat = store.getSeat(index);

      expect(seat.index.row).toBe(5);
      expect(seat.index.col).toBe(5);
      expect(seat.label).toBe('NEW LABEL');
      expect(seat.type).toBe('default');
      expect(seat.state).toBe('disabled');
    });

    it('should set type', () => {
      const index = { row: 4, col: 8 };
      store.setSeat(index, { type: 'reduced' }, false);
      const seat = store.getSeat(index);

      expect(seat.index.row).toBe(4);
      expect(seat.index.col).toBe(8);
      expect(seat.label).toBe('E9');
      expect(seat.type).toBe('reduced');
      expect(seat.state).toBe('available');
    });

    it('should set state and type', () => {
      const index = { row: 7, col: 4 };
      store.setSeat(index, { state: 'selected', type: 'first' }, false);
      const seat = store.getSeat(index);

      expect(seat.index.row).toBe(7);
      expect(seat.index.col).toBe(4);
      expect(seat.label).toBe('H5');
      expect(seat.type).toBe('first');
      expect(seat.state).toBe('selected');
    });

    it('should set state, type and label', () => {
      const index = { row: 7, col: 4 };
      store.setSeat(
        index,
        { state: 'selected', type: 'first', label: 'MY LABEL' },
        false
      );
      const seat = store.getSeat(index);

      expect(seat.index.row).toBe(7);
      expect(seat.index.col).toBe(4);
      expect(seat.label).toBe('MY LABEL');
      expect(seat.type).toBe('first');
      expect(seat.state).toBe('selected');
    });

    it('should set state to disabled', () => {
      const index = { row: 8, col: 4 };
      store.setSeat(index, { state: 'disabled' }, false);
      const seat = store.getSeat(index);

      expect(seat.state).toBe('disabled');
    });

    it('should set state to reserved', () => {
      const index = { row: 8, col: 4 };
      store.setSeat(index, { state: 'reserved' }, false);
      const seat = store.getSeat(index);

      expect(seat.state).toBe('reserved');
    });
  });
});
