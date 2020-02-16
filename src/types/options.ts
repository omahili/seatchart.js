import SeatType from './seat-type';
import MapOptions from './map-options';
import CartOptions from './cart-options';

/**
 * Options to configure a Seatchart.
 */
interface Options {
    /**
     * Map options.
     */
    map: MapOptions;
    /**
     * Seat types options.
     */
    types: Array<SeatType>;
    /**
     * Cart options.
     */
    cart?: CartOptions;
    /**
     * Legend options.
     */
    legend?: {
        /**
         * Container id.
         */
        id: string;
    };
    /**
     *  Assets options.
     */
    assets?: {
        /**
         * Path to assets.
         */
        path?: string;
    };
}

export default Options;
