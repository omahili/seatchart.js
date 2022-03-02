import { MapOptions } from 'types/map-options';
import { CartOptions } from 'types/cart-options';

/**
 * Options to configure a Seatchart.
 */
interface Options {
  /**
   * Map options.
   */
  map: MapOptions;
  /**
   * Cart options.
   */
  cart?: CartOptions;
  /**
   * Legend container id.
   */
  legendId?: string;
  /**
   * Path to assets.
   */
  assetsSrc?: string;
}

export { Options };
