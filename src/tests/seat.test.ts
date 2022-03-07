import Store from 'store';
import testingOptions from 'tests/helpers/testing-options';

describe('Seats', () => {
  describe('Get seats', () => {
    let store: Store;

    beforeEach(() => {
      store = new Store(testingOptions);
      store.init();
    });

    it('should throw a RangeError', () => {
      const getSeat = () => store.getSeat({ row: 10, col: 5 });
      expect(getSeat).toThrowError(RangeError);
    });

    it('should throw a RangeError', () => {
      const getSeat = () => store.getSeat({ row: -1, col: 4 });
      expect(getSeat).toThrowError(RangeError);
    });

    it('should throw a RangeError', () => {
      const getSeat = () => store.getSeat({ row: 4, col: 10 });
      expect(getSeat).toThrowError(RangeError);
    });

    it('should throw a RangeError', () => {
      const getSeat = () => store.getSeat({ row: 3, col: -1 });
      expect(getSeat).toThrowError(RangeError);
    });

    it('should not throw errors', () => {
      const getSeat = () => store.getSeat({ row: 9, col: 0 });
      expect(getSeat).not.toThrowError();
    });

    it('should not throw errors', () => {
      const getSeat = () => store.getSeat({ row: 0, col: 9 });
      expect(getSeat).not.toThrowError();
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

    it('should clear cart and seats be available', () => {
      store.clearCart(true);

      const seat1 = store.getSeat({ row: 0, col: 5 });
      expect(seat1.state).toBe('available');

      const seat2 = store.getSeat({ row: 6, col: 1 });
      expect(seat2.state).toBe('available');

      const seat3 = store.getSeat({ row: 8, col: 4 });
      expect(seat3.state).toBe('available');
    });
  });

  describe('Set seats', () => {
    let store: Store;

    beforeEach(() => {
      store = new Store(testingOptions);
      store.init();
    });

    it('should throw a RangeError', () => {
      const setSeat = () =>
        store.setSeat({ row: -1, col: 4 }, { type: 'default' }, false);
      expect(setSeat).toThrowError(RangeError);
    });

    it('should throw a RangeError', () => {
      const setSeat = () =>
        store.setSeat({ row: 10, col: 3 }, { type: 'default' }, false);
      expect(setSeat).toThrowError(RangeError);
    });

    it('should throw a RangeError', () => {
      const setSeat = () =>
        store.setSeat({ row: 0, col: -1 }, { type: 'default' }, false);
      expect(setSeat).toThrowError(RangeError);
    });

    it('should throw a RangeError', () => {
      const setSeat = () =>
        store.setSeat({ row: 0, col: 10 }, { type: 'default' }, false);
      expect(setSeat).toThrowError(RangeError);
    });

    it('should throw a TypeError', () => {
      const setSeat = () =>
        store.setSeat({ row: 0, col: 1 }, { type: 'inexistent' }, false);
      expect(setSeat).toThrowError(TypeError);
    });

    it('should not throw errors', () => {
      const setSeat = () =>
        store.setSeat({ row: 0, col: 9 }, { type: 'default' }, false);
      expect(setSeat).not.toThrowError();
    });

    it('should not throw errors', () => {
      const setSeat = () =>
        store.setSeat({ row: 9, col: 0 }, { type: 'reduced' }, false);
      expect(setSeat).not.toThrowError();
    });

    it('should throw a TypeError', () => {
      const setSeat = () =>
        store.setSeat({ row: 0, col: 9 }, { type: 'another1' }, false);
      expect(setSeat).toThrowError(TypeError);
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
      const index = { row: 5, col: 4 };
      store.setSeat(
        index,
        { state: 'selected', type: 'first', label: 'MY LABEL' },
        false
      );
      const seat = store.getSeat(index);

      expect(seat.index.row).toBe(5);
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
      const index = { row: 9, col: 7 };
      store.setSeat(index, { state: 'reserved' }, false);
      const seat = store.getSeat(index);

      expect(seat.state).toBe('reserved');
    });
  });
});
