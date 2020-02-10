import BaseComponent from 'components/base';
import utils from 'utils';
import { DEFAULT_TEXT_COLOR, DEFAULT_CURRENCY } from 'utils/consts';
import SeatType from 'types/seat-type';
import Seat from 'types/seat';
import CartItem from 'components/cart/item';

/**
 * @internal
 */
class CartTable extends BaseComponent<HTMLDivElement> {
    private currency: string;
    private assetsPath: string | undefined;

    /**
     * Creates the container of the items in the shopping cart.
     * @param currency - Price currency.
     * @param assetsPath - Path to assests.
     */
    public constructor(
        currency: string | undefined,
        assetsPath: string | undefined,
    ) {
        const table = document.createElement('table');
        table.className = 'sc-cart-items';

        super(table);
        this.currency = currency || DEFAULT_CURRENCY;
        this.assetsPath = assetsPath;
    }

    /**
     * Add an item to the cart.
     * @param seat - Seat info.
     * @param seatType - Seat type options.
     * @param deleteClick - Function called on detele button click.
     */
    public addItem(seat: Seat, seatType: SeatType, deleteClick: (e: HTMLElement) => any): void {
        const cartItem = new CartItem(
            seat,
            this.currency,
            this.assetsPath,
            seatType,
            deleteClick,
        );
        this.element.appendChild(cartItem.element);
    }

    /**
     * Remove an item from the cart.
     * @param id - Id of the seat to remove.
     */
    public removeItem(id: string): void {
        if (this.element) {
            const itemElement = document.getElementById(`item-${id}`);
            if (itemElement) {
                itemElement.remove();
            }
        }
    }

    /**
     * Updates an item in the cart.
     * @param seat - Seat info.
     * @param seatType - Seat type options.
     */
    public updateItem(seat: Seat, seatType: SeatType): void {
        const cartItem = document.getElementById(`item-${seat.id}`);

        if (cartItem) {
            const itemContent = cartItem.getElementsByTagName('td');

            if (seatType) {
                const ticket = <HTMLElement> itemContent[0].getElementsByClassName('sc-ticket')[0];
                ticket.style.backgroundColor = seatType.backgroundColor;
                ticket.style.color = seatType.textColor || DEFAULT_TEXT_COLOR;

                const ticketType = ticket.getElementsByClassName('sc-cart-seat-type')[0];
                ticketType.textContent = utils.capitalizeFirstLetter(seat.type);

                const ticketPrice = itemContent[1];

                if (seat.price) {
                    ticketPrice.textContent = `${this.currency}${seat.price.toFixed(2)}`;
                }
            }
        }
    }

    public countItems(): number {
        return this.element.childNodes.length;
    }
}

export default CartTable;
