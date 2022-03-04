import Store from 'store';
import {
  SeatChangeEvent,
  CartChangeEvent,
  CartClearEvent,
  SubmitEvent,
} from 'types/events';
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

    it('should disable seat and emit event', () => {
      store.setSeat({ row: 0, col: 2 }, { state: 'disabled' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(1);

      const e: SeatChangeEvent = seatchangeListener.mock.calls[0][0];
      expect(e.previous.state).toBe('available');
      expect(e.current.state).toBe('disabled');
    });

    it('should select seat and not emit event', () => {
      store.setSeat({ row: 0, col: 2 }, { state: 'available' }, false);
      expect(seatchangeListener).toHaveBeenCalledTimes(1);
    });

    it('should update seat type and emit event', () => {
      store.setSeat({ row: 8, col: 9 }, { type: 'first' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(2);

      const e: SeatChangeEvent = seatchangeListener.mock.calls[1][0];
      expect(e.previous.type).toBe('reduced');
      expect(e.current.type).toBe('first');
    });

    it('should update seat type and not emit event', () => {
      store.setSeat({ row: 8, col: 9 }, { type: 'reduced' }, false);
      expect(seatchangeListener).toHaveBeenCalledTimes(2);
    });

    it('should set seat label and emit event', () => {
      store.setSeat({ row: 0, col: 2 }, { label: '10' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(3);

      const e: SeatChangeEvent = seatchangeListener.mock.calls[2][0];
      expect(e.previous.label).toBe('A3');
      expect(e.current.label).toBe('10');
    });

    it('should clear and emit event', () => {
      store.clearCart(true);
      expect(seatchangeListener).toHaveBeenCalledTimes(6);

      const e1: SeatChangeEvent = seatchangeListener.mock.calls[3][0];
      expect(e1.previous.state).toBe('selected');
      expect(e1.current.state).toBe('available');

      const e2: SeatChangeEvent = seatchangeListener.mock.calls[4][0];
      expect(e2.previous.state).toBe('selected');
      expect(e2.current.state).toBe('available');

      const e3: SeatChangeEvent = seatchangeListener.mock.calls[5][0];
      expect(e3.previous.state).toBe('selected');
      expect(e3.current.state).toBe('available');
    });

    it('should not update state and not emit event', () => {
      store.setSeat({ row: 0, col: 3 }, { state: 'reserved' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(6);
    });

    it('should not update type and not emit event', () => {
      store.setSeat({ row: 9, col: 2 }, { type: 'reduced' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(6);
    });

    it('should remove event listener', () => {
      store.removeEventListener('seatchange', seatchangeListener);

      store.setSeat({ row: 9, col: 9 }, { type: 'reduced' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(6);
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

    it('should set different seat and not emit event', () => {
      store.setSeat({ row: 7, col: 5 }, { state: 'available' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(0);
    });

    it('should disable seat and emit event', () => {
      store.setSeat({ row: 7, col: 4 }, { state: 'disabled' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(1);

      const e: SeatChangeEvent = seatchangeListener.mock.calls[0][0];
      expect(e.previous.state).toBe('available');
      expect(e.current.state).toBe('disabled');
    });

    it('should update seat type and emit event', () => {
      store.setSeat({ row: 7, col: 4 }, { type: 'default' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(2);

      const e: SeatChangeEvent = seatchangeListener.mock.calls[1][0];
      expect(e.previous.type).toBe('reduced');
      expect(e.current.type).toBe('default');
    });

    it('should update seat label and emit event', () => {
      store.setSeat({ row: 7, col: 4 }, { label: 'NEW LABEL' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(3);

      const e: SeatChangeEvent = seatchangeListener.mock.calls[2][0];
      expect(e.previous.label).toBe('H5');
      expect(e.current.label).toBe('NEW LABEL');
    });

    it('should update seat state, type and label and emit event', () => {
      store.setSeat(
        { row: 7, col: 4 },
        { state: 'available', type: 'first', label: 'MY LABEL' },
        true
      );
      expect(seatchangeListener).toHaveBeenCalledTimes(4);

      const e: SeatChangeEvent = seatchangeListener.mock.calls[3][0];
      expect(e.previous.state).toBe('disabled');
      expect(e.current.state).toBe('available');
      expect(e.previous.type).toBe('default');
      expect(e.current.type).toBe('first');
      expect(e.previous.label).toBe('NEW LABEL');
      expect(e.current.label).toBe('MY LABEL');
    });

    it('should not update type and not emit event', () => {
      store.setSeat({ row: 7, col: 4 }, { type: 'first' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(4);
    });

    it('should update label and not emit event', () => {
      store.setSeat({ row: 7, col: 4 }, { label: 'NICE LABEL' }, false);
      expect(seatchangeListener).toHaveBeenCalledTimes(4);
    });

    it('should not update state and not emit event', () => {
      store.setSeat({ row: 7, col: 4 }, { state: 'available' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(4);
    });

    it('should update type and not emit event', () => {
      store.setSeat({ row: 7, col: 4 }, { type: 'default' }, false);
      expect(seatchangeListener).toHaveBeenCalledTimes(4);
    });

    it('should disable seat and not emit event', () => {
      store.setSeat({ row: 7, col: 4 }, { state: 'disabled' }, false);
      expect(seatchangeListener).toHaveBeenCalledTimes(4);
    });

    it('should remove event listener', () => {
      store.removeEventListener('seatchange', seatchangeListener, {
        index: { row: 7, col: 4 },
      });

      store.setSeat({ row: 7, col: 4 }, { state: 'disabled' }, true);
      expect(seatchangeListener).toHaveBeenCalledTimes(4);
    });

    it('should emit multiple listeners', () => {
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

    it('should select seat and emit event', () => {
      store.setSeat({ row: 8, col: 2 }, { state: 'selected' }, true);
      expect(cartchangeListener).toHaveBeenCalledTimes(1);

      const e: CartChangeEvent = cartchangeListener.mock.calls[0][0];
      expect(e.action).toBe('add');
      expect(e.seat.index.row).toBe(8);
      expect(e.seat.index.col).toBe(2);
      expect(e.seat.state).toBe('selected');
    });

    it('should unselect and emit event', () => {
      store.setSeat({ row: 8, col: 2 }, { state: 'available' }, true);
      expect(cartchangeListener).toHaveBeenCalledTimes(2);

      const e: CartChangeEvent = cartchangeListener.mock.calls[1][0];
      expect(e.action).toBe('remove');
      expect(e.seat.index.row).toBe(8);
      expect(e.seat.index.col).toBe(2);
      expect(e.seat.state).toBe('available');
    });

    it('should not update state and not emit event', () => {
      store.setSeat({ row: 8, col: 2 }, { state: 'available' }, true);
      expect(cartchangeListener).toHaveBeenCalledTimes(2);
    });

    it('should select seat and not emit event', () => {
      store.setSeat({ row: 8, col: 2 }, { state: 'selected' }, false);
      expect(cartchangeListener).toHaveBeenCalledTimes(2);
    });

    it('should clear and not emit event', () => {
      store.clearCart(false);
      expect(cartchangeListener).toHaveBeenCalledTimes(2);
    });

    it('should remove event listener', () => {
      store.removeEventListener('cartchange', cartchangeListener);

      store.setSeat({ row: 3, col: 8 }, { state: 'selected' }, true);
      expect(cartchangeListener).toHaveBeenCalledTimes(2);
    });

    it('should emit multiple listeners', () => {
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

    it('should emit event', () => {
      store.clearCart(true);
      expect(clearListener).toHaveBeenCalledTimes(1);

      const e: CartClearEvent = clearListener.mock.calls[0][0];
      expect(e.seats[0].index.row).toBe(0);
      expect(e.seats[0].index.col).toBe(5);
      expect(e.seats[0].state).toBe('available');

      expect(e.seats[1].index.row).toBe(6);
      expect(e.seats[1].index.col).toBe(1);
      expect(e.seats[1].state).toBe('available');

      expect(e.seats[2].index.row).toBe(8);
      expect(e.seats[2].index.col).toBe(4);
      expect(e.seats[2].state).toBe('available');
    });

    it('should emit event', () => {
      store.setSeat({ row: 1, col: 1 }, { state: 'selected' }, false);
      store.clearCart(true);
      expect(clearListener).toHaveBeenCalledTimes(2);

      const e: CartClearEvent = clearListener.mock.calls[1][0];
      expect(e.seats[0].index.row).toBe(1);
      expect(e.seats[0].index.col).toBe(1);
      expect(e.seats[0].state).toBe('available');
    });

    it('should not emit event', () => {
      store.clearCart(false);
      expect(clearListener).toHaveBeenCalledTimes(2);
    });

    it('should not emit event', () => {
      store.clearCart(true);
      expect(clearListener).toHaveBeenCalledTimes(2);
    });

    it('should remove event listener', () => {
      store.removeEventListener('cartclear', clearListener);
      store.clearCart(true);

      expect(clearListener).toHaveBeenCalledTimes(2);
    });

    it('should emit multiple listeners', () => {
      const listenerListener1 = jest.fn();
      const listenerListener2 = jest.fn();
      const listenerListener3 = jest.fn();

      store.addEventListener('cartclear', listenerListener1);
      store.addEventListener('cartclear', listenerListener2);
      store.addEventListener('cartclear', listenerListener3);

      store.setSeat({ row: 1, col: 1 }, { state: 'selected' }, false);
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
    const cartclearListener = jest.fn();

    beforeAll(() => {
      store = new Store(options);
      store.init();

      store.addEventListener('seatchange', seatchangeListener);
      store.addEventListener('cartchange', cartchangeListener);
      store.addEventListener('cartclear', cartclearListener);
    });

    it('should clear and emit in order cartclear, cartchange and seatchange events', () => {
      store.clearCart(true);
      expect(cartclearListener).toHaveBeenCalledTimes(1);
      expect(seatchangeListener).toHaveBeenCalledTimes(3);
      expect(cartchangeListener).toHaveBeenCalledTimes(3);

      const cartclearOrder = cartclearListener.mock.invocationCallOrder[0];
      const cartchangeOrder = cartchangeListener.mock.invocationCallOrder[2];
      const seatchangeOrder = seatchangeListener.mock.invocationCallOrder[2];

      expect(cartclearOrder).toBeLessThan(seatchangeOrder);
      expect(cartchangeOrder).toBeLessThan(seatchangeOrder);
    });

    it('should select seat and emit in order cartchange and seatchange', () => {
      store.setSeat({ row: 2, col: 2 }, { state: 'selected' }, true);
      expect(cartclearListener).toHaveBeenCalledTimes(1);
      expect(seatchangeListener).toHaveBeenCalledTimes(4);
      expect(cartchangeListener).toHaveBeenCalledTimes(4);

      const seatchangeOrder = seatchangeListener.mock.invocationCallOrder[2];
      const cartchangeOrder = cartchangeListener.mock.invocationCallOrder[2];

      expect(cartchangeOrder).toBeLessThan(seatchangeOrder);
    });

    it('should unselect seat and emit in order cartchange and seatchange events', () => {
      store.setSeat({ row: 2, col: 2 }, { state: 'available' }, true);
      expect(cartclearListener).toHaveBeenCalledTimes(1);
      expect(seatchangeListener).toHaveBeenCalledTimes(5);
      expect(cartchangeListener).toHaveBeenCalledTimes(5);

      const seatchangeOrder = seatchangeListener.mock.invocationCallOrder[0];
      const cartchangeOrder = cartchangeListener.mock.invocationCallOrder[0];

      expect(cartchangeOrder).toBeLessThan(seatchangeOrder);
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

    it('should emit submit event', () => {
      store.submit();
      expect(submitListener).toHaveBeenCalledTimes(1);

      const e: SubmitEvent = submitListener.mock.calls[0][0];
      expect(e.cart[0].index.row).toBe(0);
      expect(e.cart[0].index.col).toBe(5);
      expect(e.cart[0].state).toBe('selected');

      expect(e.cart[1].index.row).toBe(6);
      expect(e.cart[1].index.col).toBe(1);
      expect(e.cart[1].state).toBe('selected');

      expect(e.cart[2].index.row).toBe(8);
      expect(e.cart[2].index.col).toBe(4);
      expect(e.cart[2].state).toBe('selected');

      expect(e.total).toBe(50);
    });

    it('should remove event listener', () => {
      store.removeEventListener('submit', submitListener);
      expect(submitListener).toHaveBeenCalledTimes(1);
    });

    it('should emit multiple listeners in order', () => {
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

      const clearOrder = listenerListener1.mock.invocationCallOrder[0];
      const cartchangeOrder = listenerListener2.mock.invocationCallOrder[0];
      const seatchangeOrder = listenerListener3.mock.invocationCallOrder[0];

      expect(clearOrder).toBeLessThan(cartchangeOrder);
      expect(cartchangeOrder).toBeLessThan(seatchangeOrder);
    });
  });
});
