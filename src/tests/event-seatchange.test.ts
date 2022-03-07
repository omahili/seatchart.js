import Store from 'store';
import { SeatChangeEvent } from 'types/events';
import testingOptions from 'tests/helpers/testing-options';
import {
  AddMockListener,
  createAddMockEventListener,
} from 'tests/helpers/add-event-listener';

describe('Event seatchange', () => {
  describe('Without options', () => {
    let store: Store;
    let addEventListener: AddMockListener<SeatChangeEvent>;

    beforeEach(() => {
      store = new Store(testingOptions);
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

    it('should update whole seat and emit event', () => {
      const listener = addEventListener((e) => {
        expect(e.previous.state).toBe('available');
        expect(e.previous.label).toBe('C6');
        expect(e.previous.type).toBe('first');

        expect(e.current.state).toBe('disabled');
        expect(e.current.label).toBe('NEW');
        expect(e.current.type).toBe('reduced');
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

    it('should remove event listener and not emit event', () => {
      const listener = addEventListener();
      store.setSeat({ row: 9, col: 9 }, { type: 'reduced' }, true);
      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should emit multiple listeners in order', () => {
      const listener1 = addEventListener();
      const listener2 = addEventListener();
      const listener3 = addEventListener();

      store.setSeat({ row: 6, col: 8 }, { state: 'disabled' }, true);

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

  describe('With index option', () => {
    let store: Store;
    let addEventListener: AddMockListener<SeatChangeEvent>;

    beforeEach(() => {
      store = new Store(testingOptions);
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
        expect(e.previous.type).toBe('reduced');
        expect(e.previous.label).toBe('H5');

        expect(e.current.state).toBe('disabled');
        expect(e.current.type).toBe('first');
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

    it('should remove event listener and not emit event', () => {
      const listener = addEventListener();
      store.removeEventListener('seatchange', listener, {
        index: { row: 7, col: 4 },
      });

      store.setSeat({ row: 7, col: 4 }, { state: 'disabled' }, true);
      expect(listener).toHaveBeenCalledTimes(0);
    });

    it('should emit multiple listeners in order', () => {
      const listener1 = addEventListener();
      const listener2 = addEventListener();
      const listener3 = addEventListener();

      store.setSeat({ row: 7, col: 4 }, { state: 'disabled' }, true);

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
});
