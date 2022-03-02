import Store from 'store';
import options from 'tests/options';

describe('Cart', () => {
  describe('Cart total', () => {
    let store: Store;

    beforeAll(() => {
      store = new Store(options);
      store.init();
    });

    it('should get total', () => {
      const total = store.getCartTotal();
      expect(total).toBe(50);
    });

    it('should select seat and get total', () => {
      store.setSeat({ row: 9, col: 3 }, { state: 'selected' }, false);
      const total = store.getCartTotal();
      expect(total).toBe(60);
    });

    it('should unselect seat get total', () => {
      store.setSeat({ row: 0, col: 9 }, { state: 'available' }, false);
      const total = store.getCartTotal();
      expect(total).toBe(60);
    });

    it('should select seat and get total', () => {
      store.setSeat({ row: 2, col: 1 }, { state: 'selected' }, false);
      const total = store.getCartTotal();
      expect(total).toBe(85);
    });

    it('should update type, select seat and get total', () => {
      store.setSeat(
        { row: 6, col: 6 },
        { type: 'reduced', state: 'selected' },
        false
      );
      const total = store.getCartTotal();

      expect(total).toBe(95);
    });

    it('should clear and get total', () => {
      store.clear();
      const total = store.getCartTotal();
      expect(total).toBe(0);
    });
  });

  describe('Cart object', () => {
    let store: Store;

    beforeAll(() => {
      store = new Store(options);
      store.init();
    });

    it('should get cart object', () => {
      const cart = store.getCart();

      expect(cart['first'].length).toBe(1);
      expect(cart['default'].length).toBe(1);
      expect(cart['reduced'].length).toBe(1);
    });

    it('should select seat and get cart object', () => {
      store.setSeat({ row: 9, col: 3 }, { state: 'selected' }, false);
      const cart = store.getCart();

      expect(cart['first'].length).toBe(1);
      expect(cart['default'].length).toBe(1);
      expect(cart['reduced'].length).toBe(2);
    });

    it('should unselect seat and get cart object', () => {
      store.setSeat({ row: 9, col: 3 }, { state: 'available' }, false);
      const cart = store.getCart();

      expect(cart['first'].length).toBe(1);
      expect(cart['default'].length).toBe(1);
      expect(cart['reduced'].length).toBe(1);
    });

    it('should select two seats and get cart object', () => {
      store.setSeat({ row: 0, col: 2 }, { state: 'selected' }, false);
      store.setSeat({ row: 0, col: 3 }, { state: 'selected' }, false);
      const cart = store.getCart();

      expect(cart['first'].length).toBe(3);
      expect(cart['default'].length).toBe(1);
      expect(cart['reduced'].length).toBe(1);
    });

    it('should update seat type and state and get cart object', () => {
      store.setSeat(
        { row: 6, col: 6 },
        { type: 'reduced', state: 'selected' },
        false
      );
      const cart = store.getCart();

      expect(cart['first'].length).toBe(3);
      expect(cart['default'].length).toBe(1);
      expect(cart['reduced'].length).toBe(2);
    });

    it('should clear and get cart object', () => {
      store.clear();
      const cart = store.getCart();

      expect(cart['first'].length).toBe(0);
      expect(cart['default'].length).toBe(0);
      expect(cart['reduced'].length).toBe(0);
    });
  });
});
