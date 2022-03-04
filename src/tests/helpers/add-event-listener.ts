import Store from 'store';
import { Events } from 'types/events';

export type AddMockListener<T> = (
  fn?: ((e: T) => void) | undefined
) => jest.Mock<void, [e: T]>;

export const createAddMockEventListener = <T extends keyof Events>(
  store: Store,
  event: T
) => {
  return (fn?: (e: Events[T]) => void) => {
    const mockListener = jest.fn(fn);
    store.addEventListener(event, mockListener);
    return mockListener;
  };
};
