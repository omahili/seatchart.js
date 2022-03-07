import Store from 'store';
import { CartChangeEvent } from 'types/events';
import testingOptions from 'tests/helpers/testing-options';
import {
  AddMockListener,
  createAddMockEventListener,
} from 'tests/helpers/add-event-listener';

describe('Event cartchange', () => {
  let store: Store;
  let addEventListener: AddMockListener<CartChangeEvent>;

  beforeEach(() => {
    store = new Store(testingOptions);
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

  it('should remove event listener and not emit event', () => {
    const listener = addEventListener();
    store.removeEventListener('cartchange', listener);

    store.setSeat({ row: 3, col: 8 }, { state: 'selected' }, true);
    expect(listener).toHaveBeenCalledTimes(0);
  });

  it('should emit multiple event listeners in order', () => {
    const listener1 = addEventListener();
    const listener2 = addEventListener();
    const listener3 = addEventListener();

    store.setSeat({ row: 0, col: 5 }, { state: 'available' }, true);

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
