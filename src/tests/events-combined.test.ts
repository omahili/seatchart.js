import Store from 'store';
import {
  SeatChangeEvent,
  CartChangeEvent,
  CartClearEvent,
} from 'types/events';
import testingOptions from 'tests/helpers/testing-options';
import {
  AddMockListener,
  createAddMockEventListener,
} from 'tests/helpers/add-event-listener';

describe('Events combined', () => {
  let store: Store;
  let addCartClearEventListener: AddMockListener<CartClearEvent>;
  let addCartChangeEventListener: AddMockListener<CartChangeEvent>;
  let addSeatChangeEventListener: AddMockListener<SeatChangeEvent>;

  beforeEach(() => {
    store = new Store(testingOptions);
    store.init();

    addCartClearEventListener = createAddMockEventListener(store, 'cartclear');
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
