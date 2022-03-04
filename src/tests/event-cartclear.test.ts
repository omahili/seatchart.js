import Store from 'store';
import { CartClearEvent } from 'types/events';
import testingOptions from 'tests/helpers/testing-options';
import {
  AddMockListener,
  createAddMockEventListener,
} from 'tests/helpers/add-event-listener';

describe('Event cartclear', () => {
  let store: Store;
  let addEventListener: AddMockListener<CartClearEvent>;

  beforeEach(() => {
    store = new Store(testingOptions);
    store.init();

    addEventListener = createAddMockEventListener(store, 'cartclear');
  });

  it('should clear cart and emit event', () => {
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

  it('should select seat and emit event', () => {
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

  it('should clear cart and not emit event', () => {
    const listener = addEventListener();
    store.clearCart(false);
    expect(listener).toHaveBeenCalledTimes(0);
  });

  it('should clear cart twice and emit event once', () => {
    const listener = addEventListener();
    store.clearCart(true);
    store.clearCart(true);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should remove event listener and not emit event', () => {
    const listener = addEventListener();
    store.removeEventListener('cartclear', listener);
    store.clearCart(true);

    expect(listener).toHaveBeenCalledTimes(0);
  });

  it('should emit multiple listeners in order', () => {
    const listener1 = addEventListener();
    const listener2 = addEventListener();
    const listener3 = addEventListener();

    store.setSeat({ row: 1, col: 1 }, { state: 'selected' }, false);
    store.clearCart(true);

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
    expect(listener3).toHaveBeenCalledTimes(1);

    const listenerOrder1 = listener1.mock.invocationCallOrder[0];
    const listenerOrder2 = listener2.mock.invocationCallOrder[0];
    const listenerOrder3 = listener3.mock.invocationCallOrder[0];

    expect(listenerOrder1).toBeLessThan(listenerOrder2);
    expect(listenerOrder2).toBeLessThan(listenerOrder3);
  });
});
