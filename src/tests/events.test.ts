import Store from 'store';
import options from 'tests/options';

describe('Events', () => {
  describe('seatchange event', () => {
    let store: Store;
    const seatchangeSpy = jest.fn();

    beforeAll(() => {
      store = new Store(options);
      store.init();
      store.addEventListener('seatchange', seatchangeSpy);
    });

    it('should disable seat and trigger event', () => {
      store.setSeat({ row: 0, col: 2 }, { state: 'disabled' }, true);
      expect(seatchangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should select seat and not trigger event', () => {
      store.setSeat({ row: 0, col: 2 }, { state: 'available' }, false);
      expect(seatchangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should update seat type and trigger event', () => {
      store.setSeat({ row: 8, col: 9 }, { type: 'first' }, true);
      expect(seatchangeSpy).toHaveBeenCalledTimes(2);
    });

    it('should update seat type and not trigger event', () => {
      store.setSeat({ row: 8, col: 9 }, { type: 'reduced' }, false);
      expect(seatchangeSpy).toHaveBeenCalledTimes(2);
    });

    it('should clear and trigger event', () => {
      store.clearCart(true);
      expect(seatchangeSpy).toHaveBeenCalledTimes(5);
    });

    it('should not update state and not trigger event', () => {
      store.setSeat({ row: 0, col: 3 }, { state: 'reserved' }, true);
      expect(seatchangeSpy).toHaveBeenCalledTimes(5);
    });

    it('should not update type and not trigger event', () => {
      store.setSeat({ row: 9, col: 2 }, { type: 'reduced' }, true);
      expect(seatchangeSpy).toHaveBeenCalledTimes(5);
    });

    it('should remove event listener', () => {
      store.removeEventListener('seatchange', seatchangeSpy);

      store.setSeat({ row: 9, col: 9 }, { type: 'reduced' }, true);
      expect(seatchangeSpy).toHaveBeenCalledTimes(5);
    });
  });

  describe('seatchange event with index option', () => {
    let store: Store;
    const seatchangeSpy = jest.fn();

    beforeAll(() => {
      store = new Store(options);
      store.init();
      store.addEventListener('seatchange', seatchangeSpy, {
        index: { row: 7, col: 4 },
      });
    });

    it('should set different seat and not trigger event', () => {
      store.setSeat({ row: 7, col: 5 }, { state: 'available' }, true);
      expect(seatchangeSpy).toHaveBeenCalledTimes(0);
    });

    it('should disable seat and trigger event', () => {
      store.setSeat({ row: 7, col: 4 }, { state: 'disabled' }, true);
      expect(seatchangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should update seat type and trigger event', () => {
      store.setSeat({ row: 7, col: 4 }, { type: 'default' }, true);
      expect(seatchangeSpy).toHaveBeenCalledTimes(2);
    });

    it('should update seat state and type and trigger event', () => {
      store.setSeat(
        { row: 7, col: 4 },
        { state: 'available', type: 'first' },
        true
      );
      expect(seatchangeSpy).toHaveBeenCalledTimes(3);
    });

    it('should not update type and not trigger event', () => {
      store.setSeat({ row: 7, col: 4 }, { type: 'first' }, true);
      expect(seatchangeSpy).toHaveBeenCalledTimes(3);
    });

    it('should not update state and not trigger event', () => {
      store.setSeat({ row: 7, col: 4 }, { state: 'available' }, true);
      expect(seatchangeSpy).toHaveBeenCalledTimes(3);
    });

    it('should update type and not trigger event', () => {
      store.setSeat({ row: 7, col: 4 }, { type: 'default' }, false);
      expect(seatchangeSpy).toHaveBeenCalledTimes(3);
    });

    it('should disable seat and not trigger event', () => {
      store.setSeat({ row: 7, col: 4 }, { state: 'disabled' }, false);
      expect(seatchangeSpy).toHaveBeenCalledTimes(3);
    });

    it('should remove event listener', () => {
      store.removeEventListener('seatchange', seatchangeSpy, {
        index: { row: 7, col: 4 },
      });

      store.setSeat({ row: 7, col: 4 }, { state: 'disabled' }, true);
      expect(seatchangeSpy).toHaveBeenCalledTimes(3);
    });

    it('should trigger multiple listeners', () => {
      const listenerSpy1 = jest.fn();
      const listenerSpy2 = jest.fn();
      const listenerSpy3 = jest.fn();

      store.addEventListener('seatchange', listenerSpy1, {
        index: { row: 7, col: 4 },
      });
      store.addEventListener('seatchange', listenerSpy2, {
        index: { row: 7, col: 4 },
      });
      store.addEventListener('seatchange', listenerSpy3, {
        index: { row: 7, col: 4 },
      });

      store.setSeat({ row: 7, col: 4 }, { state: 'available' }, true);
      expect(listenerSpy1).toHaveBeenCalledTimes(1);
      expect(listenerSpy2).toHaveBeenCalledTimes(1);
      expect(listenerSpy3).toHaveBeenCalledTimes(1);
    });
  });

  describe('cartchange event', () => {
    let store: Store;
    const cartchangeSpy = jest.fn();

    beforeAll(() => {
      store = new Store(options);
      store.init();
      store.addEventListener('cartchange', cartchangeSpy);
    });

    it('should select seat and trigger event', () => {
      store.setSeat({ row: 8, col: 2 }, { state: 'selected' }, true);
      expect(cartchangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should unselect and trigger event', () => {
      store.setSeat({ row: 8, col: 2 }, { state: 'available' }, true);
      expect(cartchangeSpy).toHaveBeenCalledTimes(2);
    });

    it('should not update state and not trigger event', () => {
      store.setSeat({ row: 8, col: 2 }, { state: 'available' }, true);
      expect(cartchangeSpy).toHaveBeenCalledTimes(2);
    });

    it('should select seat and not trigger event', () => {
      store.setSeat({ row: 8, col: 2 }, { state: 'selected' }, false);
      expect(cartchangeSpy).toHaveBeenCalledTimes(2);
    });

    it('should clear and not trigger event', () => {
      store.clearCart();
      expect(cartchangeSpy).toHaveBeenCalledTimes(2);
    });

    it('should remove event listener', () => {
      store.removeEventListener('cartchange', cartchangeSpy);

      store.setSeat({ row: 3, col: 8 }, { state: 'selected' }, true);
      expect(cartchangeSpy).toHaveBeenCalledTimes(2);
    });

    it('should trigger multiple listeners', () => {
      const listenerSpy1 = jest.fn();
      const listenerSpy2 = jest.fn();
      const listenerSpy3 = jest.fn();

      store.addEventListener('cartchange', listenerSpy1);
      store.addEventListener('cartchange', listenerSpy2);
      store.addEventListener('cartchange', listenerSpy3);

      store.setSeat({ row: 3, col: 8 }, { state: 'available' }, true);
      expect(listenerSpy1).toHaveBeenCalledTimes(1);
      expect(listenerSpy2).toHaveBeenCalledTimes(1);
      expect(listenerSpy3).toHaveBeenCalledTimes(1);
    });
  });

  describe('clear event', () => {
    let store: Store;
    const clearSpy = jest.fn();

    beforeAll(() => {
      store = new Store(options);
      store.init();
      store.addEventListener('cartclear', clearSpy);
    });

    it('should not trigger event', () => {
      store.clearCart(false);
      expect(clearSpy).toHaveBeenCalledTimes(0);
    });

    it('should trigger event', () => {
      store.clearCart();
      expect(clearSpy).toHaveBeenCalledTimes(1);
    });

    it('should remove event listener', () => {
      store.removeEventListener('cartclear', clearSpy);
      store.clearCart();

      expect(clearSpy).toHaveBeenCalledTimes(1);
    });

    it('should trigger multiple listeners', () => {
      const listenerSpy1 = jest.fn();
      const listenerSpy2 = jest.fn();
      const listenerSpy3 = jest.fn();

      store.addEventListener('cartclear', listenerSpy1);
      store.addEventListener('cartclear', listenerSpy2);
      store.addEventListener('cartclear', listenerSpy3);

      store.clearCart();
      expect(listenerSpy1).toHaveBeenCalledTimes(1);
      expect(listenerSpy2).toHaveBeenCalledTimes(1);
      expect(listenerSpy3).toHaveBeenCalledTimes(1);
    });
  });

  describe('seatchange, cartchange and clear events combined', () => {
    let store: Store;
    const seatchangeSpy = jest.fn();
    const cartchangeSpy = jest.fn();
    const clearSpy = jest.fn();

    beforeAll(() => {
      store = new Store(options);
      store.init();

      store.addEventListener('seatchange', seatchangeSpy);
      store.addEventListener('cartchange', cartchangeSpy);
      store.addEventListener('cartclear', clearSpy);
    });

    it('should clear and trigger seatchange and clear events', () => {
      store.clearCart(true);
      expect(seatchangeSpy).toHaveBeenCalledTimes(3);
      expect(clearSpy).toHaveBeenCalledTimes(1);
      expect(cartchangeSpy).toHaveBeenCalledTimes(0);
    });

    it('should select seat and trigger seatchange and cartchange events', () => {
      store.setSeat({ row: 2, col: 2 }, { state: 'selected' }, true);
      expect(seatchangeSpy).toHaveBeenCalledTimes(4);
      expect(clearSpy).toHaveBeenCalledTimes(1);
      expect(cartchangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should unselect seat and trigger seatchange and cartchange events', () => {
      store.setSeat({ row: 2, col: 2 }, { state: 'available' }, true);
      expect(seatchangeSpy).toHaveBeenCalledTimes(5);
      expect(clearSpy).toHaveBeenCalledTimes(1);
      expect(cartchangeSpy).toHaveBeenCalledTimes(2);
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
      const listenerSpy1 = jest.fn();
      const listenerSpy2 = jest.fn();
      const listenerSpy3 = jest.fn();

      store.addEventListener('submit', listenerSpy1);
      store.addEventListener('submit', listenerSpy2);
      store.addEventListener('submit', listenerSpy3);

      store.submit();
      expect(listenerSpy1).toHaveBeenCalledTimes(1);
      expect(listenerSpy2).toHaveBeenCalledTimes(1);
      expect(listenerSpy3).toHaveBeenCalledTimes(1);
    });
  });
});
