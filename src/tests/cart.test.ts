import Store from 'store';
import testingOptions from 'tests/helpers/testing-options';

describe('Cart', () => {
  describe('Cart total', () => {
    let store: Store;

    beforeEach(() => {
      store = new Store(testingOptions);
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
      store.setSeat({ row: 0, col: 5 }, { state: 'available' }, false);
      const total = store.getCartTotal();
      expect(total).toBe(25);
    });

    it('should select seat and get total', () => {
      store.setSeat({ row: 2, col: 1 }, { state: 'selected' }, false);
      const total = store.getCartTotal();
      expect(total).toBe(75);
    });

    it('should update type, select seat and get total', () => {
      store.setSeat(
        { row: 6, col: 6 },
        { type: 'reduced', state: 'selected' },
        false
      );
      const total = store.getCartTotal();

      expect(total).toBe(60);
    });

    it('should clear and get total', () => {
      store.clearCart(true);
      const total = store.getCartTotal();
      expect(total).toBe(0);
    });
  });

  describe('Cart array', () => {
    let store: Store;

    beforeEach(() => {
      store = new Store(testingOptions);
      store.init();
    });

    it('should get cart array', () => {
      const cart = store.getCart();

      expect(cart.length).toBe(3);
    });

    it('should select seat and get cart array', () => {
      store.setSeat({ row: 9, col: 3 }, { state: 'selected' }, false);
      const cart = store.getCart();

      expect(cart.length).toBe(4);
    });

    it('should unselect seat and get cart array', () => {
      store.setSeat({ row: 9, col: 3 }, { state: 'available' }, false);
      const cart = store.getCart();

      expect(cart.length).toBe(3);
    });

    it('should select two seats and get cart array', () => {
      store.setSeat({ row: 0, col: 2 }, { state: 'selected' }, false);
      store.setSeat({ row: 0, col: 3 }, { state: 'selected' }, false);
      const cart = store.getCart();

      expect(cart.length).toBe(5);
    });

    it('should update seat type and get cart array', () => {
      store.setSeat({ row: 0, col: 2 }, { type: 'first' }, false);
      const cart = store.getCart();

      expect(cart.length).toBe(3);
    });

    it('should update seat type and state and get cart array', () => {
      store.setSeat(
        { row: 6, col: 6 },
        { type: 'reduced', state: 'selected' },
        false
      );
      const cart = store.getCart();

      expect(cart.length).toBe(4);
    });

    it('should clear and get cart array', () => {
      store.clearCart(true);
      const cart = store.getCart();

      expect(cart.length).toBe(0);
    });
  });
});
