import Store from 'store';
import options from 'tests/options';

describe('Events', () => {
  describe('seatchange event', () => {
    let store: Store;
    const seatchangeListener = jest.fn();

    beforeAll(() => {
      store = new Store(options);
      store.init();
      store.addEventListener('seatchange', seatchangeListener);
    });

    it('should disable seat and trigger event', () => {
      store.setSeat({ row: 0, col: 2 }, { state: 'disabled' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(1);
    });

    it('should select seat and not trigger event', () => {
      store.setSeat({ row: 0, col: 2 }, { state: 'available' }, false);
      expect(seatchangeListener).toHaveBeenCalledTimes(1);
    });

    it('should update seat type and trigger event', () => {
      store.setSeat({ row: 8, col: 9 }, { type: 'first' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(2);
    });

    it('should update seat type and not trigger event', () => {
      store.setSeat({ row: 8, col: 9 }, { type: 'reduced' }, false);
      expect(seatchangeListener).toHaveBeenCalledTimes(2);
    });

    it('should clear and trigger event', () => {
      store.clearCart(true);
      expect(seatchangeListener).toHaveBeenCalledTimes(5);
    });

    it('should not update state and not trigger event', () => {
      store.setSeat({ row: 0, col: 3 }, { state: 'reserved' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(5);
    });

    it('should not update type and not trigger event', () => {
      store.setSeat({ row: 9, col: 2 }, { type: 'reduced' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(5);
    });

    it('should remove event listener', () => {
      store.removeEventListener('seatchange', seatchangeListener);

      store.setSeat({ row: 9, col: 9 }, { type: 'reduced' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(5);
    });
  });

  describe('seatchange event with index option', () => {
    let store: Store;
    const seatchangeListener = jest.fn();

    beforeAll(() => {
      store = new Store(options);
      store.init();
      store.addEventListener('seatchange', seatchangeListener, {
        index: { row: 7, col: 4 },
      });
    });

    it('should set different seat and not trigger event', () => {
      store.setSeat({ row: 7, col: 5 }, { state: 'available' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(0);
    });

    it('should disable seat and trigger event', () => {
      store.setSeat({ row: 7, col: 4 }, { state: 'disabled' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(1);
    });

    it('should update seat type and trigger event', () => {
      store.setSeat({ row: 7, col: 4 }, { type: 'default' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(2);
    });

    it('should update seat state and type and trigger event', () => {
      store.setSeat(
        { row: 7, col: 4 },
        { state: 'available', type: 'first' },
        true
      );
      expect(seatchangeListener).toHaveBeenCalledTimes(3);
    });

    it('should not update type and not trigger event', () => {
      store.setSeat({ row: 7, col: 4 }, { type: 'first' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(3);
    });

    it('should not update state and not trigger event', () => {
      store.setSeat({ row: 7, col: 4 }, { state: 'available' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(3);
    });

    it('should update type and not trigger event', () => {
      store.setSeat({ row: 7, col: 4 }, { type: 'default' }, false);
      expect(seatchangeListener).toHaveBeenCalledTimes(3);
    });

    it('should disable seat and not trigger event', () => {
      store.setSeat({ row: 7, col: 4 }, { state: 'disabled' }, false);
      expect(seatchangeListener).toHaveBeenCalledTimes(3);
    });

    it('should remove event listener', () => {
      store.removeEventListener('seatchange', seatchangeListener, {
        index: { row: 7, col: 4 },
      });

      store.setSeat({ row: 7, col: 4 }, { state: 'disabled' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(3);
    });

    it('should trigger multiple listeners', () => {
      const listenerListener1 = jest.fn();
      const listenerListener2 = jest.fn();
      const listenerListener3 = jest.fn();

      store.addEventListener('seatchange', listenerListener1, {
        index: { row: 7, col: 4 },
      });
      store.addEventListener('seatchange', listenerListener2, {
        index: { row: 7, col: 4 },
      });
      store.addEventListener('seatchange', listenerListener3, {
        index: { row: 7, col: 4 },
      });

      store.setSeat({ row: 7, col: 4 }, { state: 'available' }, true);
      expect(listenerListener1).toHaveBeenCalledTimes(1);
      expect(listenerListener2).toHaveBeenCalledTimes(1);
      expect(listenerListener3).toHaveBeenCalledTimes(1);
    });
  });

  describe('cartchange event', () => {
    let store: Store;
    const cartchangeListener = jest.fn();

    beforeAll(() => {
      store = new Store(options);
      store.init();
      store.addEventListener('cartchange', cartchangeListener);
    });

    it('should select seat and trigger event', () => {
      store.setSeat({ row: 8, col: 2 }, { state: 'selected' }, true);
      expect(cartchangeListener).toHaveBeenCalledTimes(1);
    });

    it('should unselect and trigger event', () => {
      store.setSeat({ row: 8, col: 2 }, { state: 'available' }, true);
      expect(cartchangeListener).toHaveBeenCalledTimes(2);
    });

    it('should not update state and not trigger event', () => {
      store.setSeat({ row: 8, col: 2 }, { state: 'available' }, true);
      expect(cartchangeListener).toHaveBeenCalledTimes(2);
    });

    it('should select seat and not trigger event', () => {
      store.setSeat({ row: 8, col: 2 }, { state: 'selected' }, false);
      expect(cartchangeListener).toHaveBeenCalledTimes(2);
    });

    it('should clear and not trigger event', () => {
      store.clearCart(false);
      expect(cartchangeListener).toHaveBeenCalledTimes(2);
    });

    it('should remove event listener', () => {
      store.removeEventListener('cartchange', cartchangeListener);

      store.setSeat({ row: 3, col: 8 }, { state: 'selected' }, true);
      expect(cartchangeListener).toHaveBeenCalledTimes(2);
    });

    it('should trigger multiple listeners', () => {
      const listenerListener1 = jest.fn();
      const listenerListener2 = jest.fn();
      const listenerListener3 = jest.fn();

      store.addEventListener('cartchange', listenerListener1);
      store.addEventListener('cartchange', listenerListener2);
      store.addEventListener('cartchange', listenerListener3);

      store.setSeat({ row: 3, col: 8 }, { state: 'available' }, true);
      expect(listenerListener1).toHaveBeenCalledTimes(1);
      expect(listenerListener2).toHaveBeenCalledTimes(1);
      expect(listenerListener3).toHaveBeenCalledTimes(1);
    });
  });

  describe('clear event', () => {
    let store: Store;
    const clearListener = jest.fn();

    beforeAll(() => {
      store = new Store(options);
      store.init();
      store.addEventListener('cartclear', clearListener);
    });

    it('should not trigger event', () => {
      store.clearCart(false);
      expect(clearListener).toHaveBeenCalledTimes(0);
    });

    it('should trigger event', () => {
      store.clearCart(true);
      expect(clearListener).toHaveBeenCalledTimes(1);
    });

    it('should remove event listener', () => {
      store.removeEventListener('cartclear', clearListener);
      store.clearCart(true);

      expect(clearListener).toHaveBeenCalledTimes(1);
    });

    it('should trigger multiple listeners', () => {
      const listenerListener1 = jest.fn();
      const listenerListener2 = jest.fn();
      const listenerListener3 = jest.fn();

      store.addEventListener('cartclear', listenerListener1);
      store.addEventListener('cartclear', listenerListener2);
      store.addEventListener('cartclear', listenerListener3);

      store.clearCart(true);
      expect(listenerListener1).toHaveBeenCalledTimes(1);
      expect(listenerListener2).toHaveBeenCalledTimes(1);
      expect(listenerListener3).toHaveBeenCalledTimes(1);
    });
  });

  describe('seatchange, cartchange and clear events combined', () => {
    let store: Store;
    const seatchangeListener = jest.fn();
    const cartchangeListener = jest.fn();
    const clearListener = jest.fn();

    beforeAll(() => {
      store = new Store(options);
      store.init();

      store.addEventListener('seatchange', seatchangeListener);
      store.addEventListener('cartchange', cartchangeListener);
      store.addEventListener('cartclear', clearListener);
    });

    it('should clear and trigger seatchange, cartchange and cartclear events', () => {
      store.clearCart(true);
      expect(seatchangeListener).toHaveBeenCalledTimes(3);
      expect(clearListener).toHaveBeenCalledTimes(1);
      expect(cartchangeListener).toHaveBeenCalledTimes(3);
    });

    it('should select seat and trigger seatchange and cartchange', () => {
      store.setSeat({ row: 2, col: 2 }, { state: 'selected' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(4);
      expect(clearListener).toHaveBeenCalledTimes(1);
      expect(cartchangeListener).toHaveBeenCalledTimes(4);
    });

    it('should unselect seat and trigger seatchange and cartchange events', () => {
      store.setSeat({ row: 2, col: 2 }, { state: 'available' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(5);
      expect(clearListener).toHaveBeenCalledTimes(1);
      expect(cartchangeListener).toHaveBeenCalledTimes(5);
    });
  });

  describe('submit event', () => {
    let store: Store;
    const submitListener = jest.fn();

    beforeAll(() => {
      store = new Store(options);
      store.init();

      store.addEventListener('submit', submitListener);
    });

    it('should trigger submit event', () => {
      store.submit();
      expect(submitListener).toHaveBeenCalledTimes(1);
    });

    it('should remove event listener', () => {
      store.removeEventListener('submit', submitListener);
      expect(submitListener).toHaveBeenCalledTimes(1);
    });

    it('should trigger multiple listeners', () => {
      const listenerListener1 = jest.fn();
      const listenerListener2 = jest.fn();
      const listenerListener3 = jest.fn();

      store.addEventListener('submit', listenerListener1);
      store.addEventListener('submit', listenerListener2);
      store.addEventListener('submit', listenerListener3);

      store.submit();
      expect(listenerListener1).toHaveBeenCalledTimes(1);
      expect(listenerListener2).toHaveBeenCalledTimes(1);
      expect(listenerListener3).toHaveBeenCalledTimes(1);
    });
  });
});
