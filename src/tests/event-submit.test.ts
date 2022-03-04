import Store from 'store';
import { SubmitEvent } from 'types/events';
import testingOptions from 'tests/helpers/testing-options';
import {
  AddMockListener,
  createAddMockEventListener,
} from 'tests/helpers/add-event-listener';

describe('Event submit', () => {
  let store: Store;
  let addEventListener: AddMockListener<SubmitEvent>;

  beforeEach(() => {
    store = new Store(testingOptions);
    store.init();

    addEventListener = createAddMockEventListener(store, 'submit');
  });

  it('should submit and emit event', () => {
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

  it('should remove event listener and not emit event', () => {
    const listener = addEventListener();
    store.removeEventListener('submit', listener);
    store.submit();
    expect(listener).toHaveBeenCalledTimes(0);
  });

  it('should emit multiple listeners in order', () => {
    const listener1 = addEventListener();
    const listener2 = addEventListener();
    const listener3 = addEventListener();

    store.submit();

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
