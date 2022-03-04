import Store from 'store';
import {
  SeatChangeEvent,
  CartChangeEvent,
  CartClearEvent,
  SubmitEvent,
  Events,
} from 'types/events';
import options from 'tests/options';

type AddMockListener<T> = (
  fn?: ((e: T) => void) | undefined
) => jest.Mock<void, [e: T]>;

const createAddMockEventListener = <T extends keyof Events>(
  store: Store,
  event: T
) => {
  return (fn?: (e: Events[T]) => void) => {
    const mockListener = jest.fn(fn);
    store.addEventListener(event, mockListener);
    return mockListener;
  };
};

describe('Events', () => {
  describe('seatchange event', () => {
    let store: Store;
    let addEventListener: AddMockListener<SeatChangeEvent>;

    beforeEach(() => {
      store = new Store(options);
      store.init();

      addEventListener = createAddMockEventListener(store, 'seatchange');
    });

    it('should disable seat and emit event', () => {
      const listener = addEventListener((e) => {
        expect(e.previous.state).toBe('available');
        expect(e.current.state).toBe('disabled');
      });

      store.setSeat({ row: 0, col: 2 }, { state: 'disabled' }, true);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should select seat and not emit event', () => {
      const listener = addEventListener();
      store.setSeat({ row: 0, col: 2 }, { state: 'available' }, false);

      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should update seat type and emit event', () => {
      const listener = addEventListener((e) => {
        expect(e.previous.type).toBe('reduced');
        expect(e.current.type).toBe('first');
      });

      store.setSeat({ row: 8, col: 9 }, { type: 'first' }, true);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should update seat type and not emit event', () => {
      const listener = addEventListener();
      store.setSeat({ row: 8, col: 9 }, { type: 'reduced' }, false);

      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should set seat label and emit event', () => {
      const listener = addEventListener((e) => {
        expect(e.previous.label).toBe('A3');
        expect(e.current.label).toBe('10');
      });
      store.setSeat({ row: 0, col: 2 }, { label: '10' }, true);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should whole seat and emit event', () => {
      const listener = addEventListener((e) => {
        expect(e.previous).toMatchObject({
          state: 'available',
          label: 'C6',
          type: 'first',
        });

        expect(e.current).toMatchObject({
          state: 'disabled',
          label: 'NEW',
          type: 'reduced',
        });
      });
      store.setSeat(
        { row: 2, col: 5 },
        { label: 'NEW', type: 'reduced', state: 'disabled' },
        true
      );
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should clear and emit event', () => {
      const listener = addEventListener();
      store.clearCart(true);

      expect(listener).toHaveBeenCalledTimes(3);

      const e1 = listener.mock.calls[0][0];
      expect(e1.previous.state).toBe('selected');
      expect(e1.current.state).toBe('available');

      const e2 = listener.mock.calls[1][0];
      expect(e2.previous.state).toBe('selected');
      expect(e2.current.state).toBe('available');

      const e3 = listener.mock.calls[2][0];
      expect(e3.previous.state).toBe('selected');
      expect(e3.current.state).toBe('available');
    });

    it('should not update state and not emit event', () => {
      const listener = addEventListener();
      store.setSeat({ row: 0, col: 3 }, { state: 'reserved' }, true);
      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should not update type and not emit event', () => {
      const listener = addEventListener();
      store.setSeat({ row: 9, col: 2 }, { type: 'reduced' }, true);
      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should remove event listener', () => {
      const listener = addEventListener();
      store.setSeat({ row: 9, col: 9 }, { type: 'reduced' }, true);
      expect(listener).toHaveBeenCalledTimes(0);
    });
  });

  describe('seatchange event with index option', () => {
    let store: Store;
    let addEventListener: AddMockListener<SeatChangeEvent>;

    beforeEach(() => {
      store = new Store(options);
      store.init();

      addEventListener = (fn?: (e: SeatChangeEvent) => void) => {
        const listener = jest.fn(fn);
        store.addEventListener('seatchange', listener, {
          index: { row: 7, col: 4 },
        });
        return listener;
      };
    });

    it('should set different seat and not emit event', () => {
      const listener = addEventListener();
      store.setSeat({ row: 7, col: 5 }, { state: 'available' }, true);
      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should disable seat and emit event', () => {
      const listener = addEventListener((e) => {
        expect(e.previous.state).toBe('available');
        expect(e.current.state).toBe('disabled');
      });
      store.setSeat({ row: 7, col: 4 }, { state: 'disabled' }, true);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should update seat type and emit event', () => {
      const listener = addEventListener((e) => {
        expect(e.previous.type).toBe('reduced');
        expect(e.current.type).toBe('default');
      });
      store.setSeat({ row: 7, col: 4 }, { type: 'default' }, true);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should update seat label and emit event', () => {
      const listener = addEventListener((e) => {
        expect(e.previous.label).toBe('H5');
        expect(e.current.label).toBe('NEW LABEL');
      });
      store.setSeat({ row: 7, col: 4 }, { label: 'NEW LABEL' }, true);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should update seat state, type and label and emit event', () => {
      const listener = addEventListener((e) => {
        expect(e.previous.state).toBe('available');
        expect(e.current.state).toBe('disabled');
        expect(e.previous.type).toBe('reduced');
        expect(e.current.type).toBe('first');
        expect(e.previous.label).toBe('H5');
        expect(e.current.label).toBe('MY LABEL');
      });

      store.setSeat(
        { row: 7, col: 4 },
        { state: 'disabled', type: 'first', label: 'MY LABEL' },
        true
      );
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should not update type and not emit event', () => {
      const listener = addEventListener();
      store.setSeat({ row: 7, col: 4 }, { type: 'reduced' }, true);
      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should update label and not emit event', () => {
      const listener = addEventListener();
      store.setSeat({ row: 7, col: 4 }, { label: 'NICE LABEL' }, false);
      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should not update state and not emit event', () => {
      const listener = addEventListener();
      store.setSeat({ row: 7, col: 4 }, { state: 'available' }, true);
      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should update type and not emit event', () => {
      const listener = addEventListener();
      store.setSeat({ row: 7, col: 4 }, { type: 'default' }, false);
      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should disable seat and not emit event', () => {
      const listener = addEventListener();
      store.setSeat({ row: 7, col: 4 }, { state: 'disabled' }, false);
      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should remove event listener', () => {
      const listener = addEventListener();
      store.removeEventListener('seatchange', listener, {
        index: { row: 7, col: 4 },
      });

      store.setSeat({ row: 7, col: 4 }, { state: 'disabled' }, true);
      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should emit multiple listeners', () => {
      const listenerListener1 = addEventListener();
      const listenerListener2 = addEventListener();
      const listenerListener3 = addEventListener();

      store.setSeat({ row: 7, col: 4 }, { state: 'disabled' }, true);
      expect(listenerListener1).toHaveBeenCalledTimes(1);
      expect(listenerListener2).toHaveBeenCalledTimes(1);
      expect(listenerListener3).toHaveBeenCalledTimes(1);
    });
  });

  describe('cartchange event', () => {
    let store: Store;
    let addEventListener: AddMockListener<CartChangeEvent>;

    beforeEach(() => {
      store = new Store(options);
      store.init();

      addEventListener = createAddMockEventListener(store, 'cartchange');
    });

    it('should select seat and emit event', () => {
      const listener = addEventListener((e) => {
        expect(e.action).toBe('add');
        expect(e.seat.index.row).toBe(8);
        expect(e.seat.index.col).toBe(2);
        expect(e.seat.state).toBe('selected');
      });
      store.setSeat({ row: 8, col: 2 }, { state: 'selected' }, true);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should unselect and emit event', () => {
      const listener = addEventListener((e) => {
        expect(e.action).toBe('remove');
        expect(e.seat.index.row).toBe(0);
        expect(e.seat.index.col).toBe(5);
        expect(e.seat.state).toBe('available');
      });
      store.setSeat({ row: 0, col: 5 }, { state: 'available' }, true);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should not update state and not emit event', () => {
      const listener = addEventListener();
      store.setSeat({ row: 8, col: 2 }, { state: 'available' }, true);
      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should select seat and not emit event', () => {
      const listener = addEventListener();
      store.setSeat({ row: 8, col: 2 }, { state: 'selected' }, false);
      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should clear and not emit event', () => {
      const listener = addEventListener();
      store.clearCart(false);
      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should remove event listener', () => {
      const listener = addEventListener();
      store.removeEventListener('cartchange', listener);

      store.setSeat({ row: 3, col: 8 }, { state: 'selected' }, true);
      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should emit multiple listeners', () => {
      const listenerListener1 = addEventListener();
      const listenerListener2 = addEventListener();
      const listenerListener3 = addEventListener();

      store.setSeat({ row: 0, col: 5 }, { state: 'available' }, true);

      expect(listenerListener1).toHaveBeenCalledTimes(1);
      expect(listenerListener2).toHaveBeenCalledTimes(1);
      expect(listenerListener3).toHaveBeenCalledTimes(1);
    });
  });

  describe('clear event', () => {
    let store: Store;
    let addEventListener: AddMockListener<CartClearEvent>;

    beforeEach(() => {
      store = new Store(options);
      store.init();

      addEventListener = createAddMockEventListener(store, 'cartclear');
    });

    it('should emit clear event', () => {
      const listener = addEventListener();
      store.clearCart(true);
      expect(listener).toHaveBeenCalledTimes(1);

      const e: CartClearEvent = listener.mock.calls[0][0];
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
      store.clearCart(true);
      const listener = addEventListener((e) => {
        expect(e.seats[0].index.row).toBe(1);
        expect(e.seats[0].index.col).toBe(1);
        expect(e.seats[0].state).toBe('available');
      });
      store.setSeat({ row: 1, col: 1 }, { state: 'selected' }, false);
      store.clearCart(true);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should not emit event', () => {
      const listener = addEventListener();
      store.clearCart(false);
      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should not emit event', () => {
      store.clearCart(true);

      const listener = addEventListener();
      store.clearCart(true);
      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should remove event listener', () => {
      const listener = addEventListener();
      store.removeEventListener('cartclear', listener);
      store.clearCart(true);

      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should emit multiple listeners', () => {
      const listenerListener1 = addEventListener();
      const listenerListener2 = addEventListener();
      const listenerListener3 = addEventListener();

      store.setSeat({ row: 1, col: 1 }, { state: 'selected' }, false);
      store.clearCart(true);

      expect(listenerListener1).toHaveBeenCalledTimes(1);
      expect(listenerListener2).toHaveBeenCalledTimes(1);
      expect(listenerListener3).toHaveBeenCalledTimes(1);
    });
  });

  describe('seatchange, cartchange and clear events combined', () => {
    let store: Store;
    let addCartClearEventListener: AddMockListener<CartClearEvent>;
    let addCartChangeEventListener: AddMockListener<CartChangeEvent>;
    let addSeatChangeEventListener: AddMockListener<SeatChangeEvent>;

    beforeEach(() => {
      store = new Store(options);
      store.init();

      addCartClearEventListener = createAddMockEventListener(
        store,
        'cartclear'
      );
      addCartChangeEventListener = createAddMockEventListener(
        store,
        'cartchange'
      );
      addSeatChangeEventListener = createAddMockEventListener(
        store,
        'seatchange'
      );
    });

    it('should clear and emit in order cartclear, cartchange and seatchange events', () => {
      const cartclearListener = addCartClearEventListener();
      const cartchangeListener = addCartChangeEventListener();
      const seatchangeListener = addSeatChangeEventListener();

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
      const cartclearListener = addCartClearEventListener();
      const cartchangeListener = addCartChangeEventListener();
      const seatchangeListener = addSeatChangeEventListener();

      store.setSeat({ row: 2, col: 2 }, { state: 'selected' }, true);
      expect(cartclearListener).toHaveBeenCalledTimes(0);
      expect(seatchangeListener).toHaveBeenCalledTimes(1);
      expect(cartchangeListener).toHaveBeenCalledTimes(1);

      const seatchangeOrder = seatchangeListener.mock.invocationCallOrder[0];
      const cartchangeOrder = cartchangeListener.mock.invocationCallOrder[0];

      expect(cartchangeOrder).toBeLessThan(seatchangeOrder);
    });

    it('should unselect seat and emit in order cartchange and seatchange events', () => {
      const cartclearListener = addCartClearEventListener();
      const cartchangeListener = addCartChangeEventListener();
      const seatchangeListener = addSeatChangeEventListener();

      store.setSeat({ row: 6, col: 1 }, { state: 'available' }, true);

      expect(cartclearListener).toHaveBeenCalledTimes(0);
      expect(seatchangeListener).toHaveBeenCalledTimes(1);
      expect(cartchangeListener).toHaveBeenCalledTimes(1);

      const seatchangeOrder = seatchangeListener.mock.invocationCallOrder[0];
      const cartchangeOrder = cartchangeListener.mock.invocationCallOrder[0];

      expect(cartchangeOrder).toBeLessThan(seatchangeOrder);
    });
  });

  describe('submit event', () => {
    let store: Store;
    let addEventListener: AddMockListener<SubmitEvent>;

    beforeEach(() => {
      store = new Store(options);
      store.init();

      addEventListener = createAddMockEventListener(store, 'submit');
    });

    it('should emit submit event', () => {
      const listener = addEventListener();
      store.submit();
      expect(listener).toHaveBeenCalledTimes(1);

      const e: SubmitEvent = listener.mock.calls[0][0];
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
      const listener = addEventListener();
      store.removeEventListener('submit', listener);
      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should emit multiple listeners in order', () => {
      const listenerListener1 = addEventListener();
      const listenerListener2 = addEventListener();
      const listenerListener3 = addEventListener();

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
