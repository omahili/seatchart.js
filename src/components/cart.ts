import NotFoundError from 'errors/not-found-error';
import Seatchart from 'seatchart';
import { DEFAULT_CURRENCY, DEFAULT_TEXT_COLOR } from 'utils/consts';
import { ClearEvent } from 'utils/events';
import Options from 'utils/options';
import Seat from 'utils/seat';
import utils from 'utils/utils';

class Cart {
    /**
     * A dictionary containing all seats added to the shopping cart, mapped by seat type.
     * Each string is composed by row (r) and column (c) indexed in the following format: "r_c",
     * which is the id of the seat in the document.
     * @type {Object<string, Array.<number>>}
     * @property {string} - Seat type.
     * @property {Array.<number>} - Ids of the seats added to the cart.
     */
    public dict: { [key: string]: string[] } = {};

    /**
     * The main div container containing all the shopping cart elements.
     * @type {HTMLDivElement}
     * @private
     */
    private cartTable: HTMLDivElement | undefined;

    /**
     * The text that shows the total cost of the items in the shopping cart.
     * @type {HTMLHeadingElement}
     * @private
     */
    private cartTotal: HTMLHeadingElement | undefined;

    /**
     * Text that show total number of items in the shopping cart.
     * @type {HTMLHeadingElement}
     * @private
     */
    private cartItemsCounter: HTMLHeadingElement | undefined;

    /**
     * An object containing all seats added to the shopping cart, mapped by seat type.
     * @type {Object<string, Array.<number>>}
     * @private
     */
    private cart: { [key: string]: number[] } = {};

    /**
     * An array of strings containing all the pickable seat types, "available" included.
     * @type {Array.<string>}
     * @private
     */
    private types: string[] = [];

    private options: Options;
    private map: Seatchart;

    public constructor(map: Seatchart) {
        this.options = map.options;
        this.map = map;

        this.loadCart();
        this.createCart();
    }

    /**
     * Gets a reference to the shopping cart object.
     * @returns {Object<string, Array.<number>>} An object containing all seats added to the shopping cart,
     * mapped by seat type.
     */
    public getCart(): { [key: string]: number[] } {
        return this.cart;
    }

    /**
     * Gets the total price of the selected seats.
     * @returns {number} The total price.
     */
    public getTotal(): number {
        let total = 0;
        const keys = Object.keys(this.dict);
        for (const key of keys) {
            total += this.getPrice(key) * this.dict[key].length;
        }

        return total;
    }

    /**
     * Gets the price for a specific type of seat.
     * @param {string} type - The type of the seat.
     * @returns {number} Price.
     */
    public getPrice(type: string): number {
        for (const seatType of this.options.types) {
            if (seatType.type === type) {
                return seatType.price;
            }
        }

        throw new NotFoundError('Seat price not found.');
    }

    /**
     * Updates the shopping cart by adding, removing or updating a seat.
     * @param {string} action - Action on the shopping cart ('remove' | 'add' | 'update').
     * @param {string} id - Id of the seat in the dom.
     * @param {string} type - New seat type.
     * @param {string} previousType - Previous seat type.
     * @param {boolean} emit - True to trigger onChange events.
     */
    public updateCart(action: string, id: string, type: string, previousType: string, emit: boolean): void {
        const name = this.map.getSeatName(id);
        const index = this.getIndexFromId(id);
        const price = type && !['available', 'disabled', 'reserved'].includes(type) ?
            this.getPrice(type) :
            null;

        const current: Seat = {
            id,
            index,
            name,
            price,
            type,
        };
        const previous: Seat = {
            id,
            index,
            name,
            price: previousType && !['available', 'disabled', 'reserved'].includes(previousType) ?
                this.getPrice(previousType) :
                null,
            type: previousType,
        };

        let cartItem;

        this.updateCartObject();

        if (action === 'remove') {
            if (this.cartTable) {
                const itemElement = document.getElementById(`item-${id}`);
                if (itemElement) {
                    itemElement.remove();
                }
            }

            if (emit && this.map.onChange) {
                this.map.onChange({
                    action,
                    current,
                    previous,
                });
            }
        } else if (action === 'add') {
            if (this.cartTable) {
                cartItem = this.createCartItem(current);
                this.cartTable.appendChild(cartItem);
            }

            if (emit && this.map.onChange) {
                this.map.onChange({
                    action,
                    current,
                    previous,
                });
            }
        } else if (action === 'update') {
            if (this.cartTable) {
                cartItem = document.getElementById(`item-${id}`);

                if (cartItem) {
                    const itemContent = cartItem.getElementsByTagName('td');

                    const seatConfig = this.options.types.find(x => x.type === current.type);

                    if (seatConfig) {
                        const ticket = <HTMLElement> itemContent[0].getElementsByClassName('sc-ticket')[0];
                        ticket.style.backgroundColor = seatConfig.backgroundColor;
                        ticket.style.color = seatConfig.textColor || DEFAULT_TEXT_COLOR;

                        const ticketType = ticket.getElementsByClassName('sc-cart-seat-type')[0];
                        ticketType.textContent = utils.capitalizeFirstLetter(current.type);

                        const ticketPrice = itemContent[1];

                        if (current.price) {
                            const currency = this.options.cart?.currency || '€';
                            ticketPrice.textContent = `${currency}${current.price.toFixed(2)}`;
                        }
                    }
                }
            }

            if (emit && this.map.onChange) {
                this.map.onChange({
                    action,
                    current,
                    previous,
                });
            }
        }
    }

    /**
     * Adds a seat to the shopping cart dictionary.
     * @param {string} id - The dom id of the seat in the seatmap.
     * @param {string} type - The type of the seat.
     * @returns {boolean} True if the seat is added correctly otherwise false.
     */
    public addTodict(id: string, type: string): boolean {
        if (type in this.dict) {
            if ({}.hasOwnProperty.call(this.dict, type)) {
                this.dict[type].push(id);
                return true;
            }
        }

        return false;
    }

    /**
     * Removes a seat from the shopping cart dictionary containing it.
     * @param {string} id - The dom id of the seat in the seatmap.
     * @param {string} type - The type of the seat.
     * @returns {boolean} True if the seat is removed correctly otherwise false.
     */
    public removeFromdict(id: string, type: string): boolean {
        if (type !== undefined) {
            if (type in this.dict) {
                const index = this.dict[type].indexOf(id);
                if (index > -1) {
                    this.dict[type].splice(index, 1);
                    return true;
                }
            }
        } else {
            const keys = Object.keys(this.dict);
            for (const key of keys) {
                if (this.removeFromdict(id, key)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Updates the total price and items counter in the shopping cart.
     */
    public updateTotal(): void {
        if (this.cartTotal) {
            const currency = this.options.cart?.currency || DEFAULT_CURRENCY;
            this.cartTotal.textContent = `Total: ${currency}${this.getTotal().toFixed(2)}`;
        }

        if (this.cartItemsCounter && this.cartTable) {
            this.cartItemsCounter.textContent = `(${this.cartTable.childNodes.length})`;
        }
    }

    /**
     * Creates the shopping cart.
     * @private
     */
    private createCart(): void {
        if (this.options.cart) {
            const cartContainer = utils.DOM.createContainer('cart', 'column');
            const assetPath = this.options.assets && this.options.assets.path ?
                `${this.options.assets.path}/shoppingcart.svg` :
                '../assets/bin.svg';

            const cartTitle = utils.DOM.createIconedTitle(
                'Your Cart',
                assetPath,
                'Shopping cart icon.',
            );

            const cartTableContainer = document.createElement('div');
            cartTableContainer.classList.add('sc-cart');
            cartTableContainer.style.width = `${this.options.cart.width}px`;
            cartTableContainer.style.height = `${this.options.cart.height}px`;

            this.cartTable = this.createCartTable();
            cartTableContainer.appendChild(this.cartTable);

            const itemsCount = this.loadCartItems();
            const cartTotal = this.createCartTotal();

            this.cartItemsCounter = this.createCartItemsCounter(itemsCount);
            cartTitle.appendChild(this.cartItemsCounter);

            cartContainer.appendChild(cartTitle);
            cartContainer.appendChild(cartTableContainer);
            cartContainer.appendChild(cartTotal);

            const cart = document.getElementById(this.options.cart.id);
            if (cart) {
                cart.appendChild(cartContainer);
            }
        }
    }

    /**
     * Creates the total of the shopping cart and a "delete all" button.
     * @returns {HTMLDivElement} The total and "delete all" button.
     * @private
     */
    private createCartTotal(): HTMLDivElement {
        const container = document.createElement('div');
        const currency = this.options.cart?.currency || DEFAULT_TEXT_COLOR;
        this.cartTotal = this.createSmallTitle(`Total: ${currency}${this.getTotal()}`);
        this.cartTotal.className += ' sc-cart-total';

        const deleteBtn = this.createScDeleteButton();
        deleteBtn.onclick = this.deleteAllClick.bind(this);
        deleteBtn.className += ' all';

        const label = document.createElement('p');
        label.textContent = 'All';
        deleteBtn.appendChild(label);

        container.appendChild(this.cartTotal);
        container.appendChild(deleteBtn);

        return container;
    }

    /**
     * Creates a ticket to place into the shopping cart.
     * @param {Seat} seat - Seat info.
     * @returns {HTMLDivElement} The ticket.
     * @private
     */
    private createTicket(seat: Seat): HTMLDivElement {
        const seatConfig = this.options.types.find(x => x.type === seat.type);

        if (!seatConfig) {
            throw new NotFoundError(`Options for seat type '${seat.type}' not found.`);
        }

        const ticket = document.createElement('div');
        ticket.className = 'sc-ticket';
        ticket.style.color = seatConfig.textColor || DEFAULT_TEXT_COLOR;
        ticket.style.backgroundColor = seatConfig.backgroundColor;

        const stripes = document.createElement('div');
        stripes.className = 'sc-ticket-stripes';

        const seatName = document.createElement('div');
        seatName.textContent = seat.name;
        seatName.className = 'sc-cart-seat-name';

        const seatType = document.createElement('div');
        seatType.textContent = utils.capitalizeFirstLetter(seat.type);
        seatType.className = 'sc-cart-seat-type';

        ticket.appendChild(stripes);
        ticket.appendChild(seatName);
        ticket.appendChild(seatType);
        ticket.appendChild(stripes.cloneNode(true));

        return ticket;
    }

    /**
     * Updates shopping cart object: values stored into dict are mapped to fit
     * cart type and format. (See private variables dict and cart.)
     * @private
     */
    private updateCartObject(): void {
        const keys = Object.keys(this.dict);
        for (const s of keys) {
            this.cart[s] = this.dict[s].map(x => this.getIndexFromId(x));
        }
    }

    /**
     * Create a delete button for a shopping cart item.
     * @returns {HTMLDivElement} The delete button.
     * @private
     */
    private createScDeleteButton(): HTMLDivElement {
        const binImg = document.createElement('img');
        binImg.src = this.options.assets?.path ?
            `${this.options.assets.path}/bin.svg` :
            '../assets/bin.svg';

        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'sc-cart-delete';
        deleteBtn.appendChild(binImg);

        return deleteBtn;
    }

    /**
     * This function is fired when the "delete all" button is clicked in the shopping cart.
     * @private
     */
    private deleteAllClick(): void {
        const removedSeats: ClearEvent = [];

        const keys = Object.keys(this.dict);

        // release all selected seats and remove them from dictionary
        for (const key of keys) {
            for (const id of this.dict[key]) {
                this.map.releaseSeat(id);

                // fire event
                if (this.map.onChange != null) {
                    const index = this.getIndexFromId(id);
                    const seatName = this.map.getSeatName(id);
                    const type = this.map.getSeatType(id);

                    const current: Seat = {
                        id,
                        index,
                        name: seatName,
                        price: null,
                        type: 'available',
                    };
                    const previous: Seat = {
                        id,
                        index,
                        name: seatName,
                        price: this.getPrice(type),
                        type,
                    };

                    removedSeats.push({ current, previous });
                }
            }

            // empty array, fastest way instead of removing each seat
            this.dict[key] = [];
        }

        // empty shopping cart, fastest way instead of removing each item
        if (this.cartTable) {
            this.emptyElement(this.cartTable);
        }

        this.updateTotal();

        if (this.map.onClear) {
            this.map.onClear(removedSeats);
        }
    }

    /**
     * Creates a small title.
     * @param {string} content - The content of the title.
     * @returns {HTMLHeadingElement} The small title.
     * @private
     */
    private createSmallTitle(content: string): HTMLHeadingElement {
        const smallTitle = document.createElement('h5');
        smallTitle.textContent = content;
        smallTitle.className = 'sc-small-title';

        return smallTitle;
    }

    /**
     * Creates the container of the items in the shopping cart.
     * @returns {HTMLDivElement} The container of the items.
     * @private
     */
    private createCartTable(): HTMLDivElement {
        const container = document.createElement('table');
        container.className = 'sc-cart-items';

        return container;
    }

    /**
     * Creates text that contains total number of items in the shopping cart.
     * @param {number} count - Number of item in the shopping cart.
     * @returns {HTMLDivElement} The total and "delete all" button.
     * @private
     */
    private createCartItemsCounter(count: number): HTMLDivElement {
        const cartItemsCount = document.createElement('h3');
        cartItemsCount.textContent = `(${count})`;

        return cartItemsCount;
    }

    /**
     * Loads seats, given with seat types, into the shopping cart.
     * @returns {number} Number of loaded items.
     * @private
     */
    private loadCartItems(): number {
        let count = 0;

        for (const seatType of this.options.types) {
            if (seatType.selected) {
                const type = seatType.type;
                const price = seatType.price;

                count += seatType.selected.length;

                for (const index of seatType.selected) {
                    const row = Math.floor(index / this.options.map.columns);
                    const column = index % this.options.map.columns;
                    const id = `${row}_${column}`;
                    const name = this.map.getSeatName(id);

                    const seat: Seat = {
                        id,
                        index,
                        name,
                        price,
                        type,
                    };
                    const cartItem = this.createCartItem(seat);

                    if (this.cartTable) {
                        this.cartTable.appendChild(cartItem);
                    }
                }
            }
        }

        return count;
    }

    /**
     * This function is fired when a delete button is clicked in the shopping cart.
     * @private
     */
    private deleteClick(item: Element): () => void {
        return (): void => {
            const elementId = item.getAttribute('id');

            if (elementId) {
                const parentElement = document.getElementById(elementId);
                if (parentElement) {
                    parentElement.remove();
                }

                const id = elementId.split('-')[1];
                const type = this.map.getSeatType(id);

                this.map.releaseSeat(id);
                this.removeFromdict(id, type);
                this.updateTotal();

                // fire event
                if (this.map.onChange != null) {
                    const index = this.getIndexFromId(id);
                    const seatName = this.map.getSeatName(id);

                    const current: Seat = {
                        id,
                        index,
                        name: seatName,
                        price: null,
                        type: 'available',
                    };
                    const previous: Seat = {
                        id,
                        index,
                        name: seatName,
                        price: this.getPrice(type),
                        type,
                    };

                    this.map.onChange({
                        action: 'remove',
                        current,
                        previous,
                    });
                }
            }
        };
    }

    /**
     * Loads seats into dict.
     * @private
     */
    private loadCart(): void {
        // create array of seat types
        this.initializeSeatTypes();

        // Add selected seats to shopping cart
        for (const seatType of this.options.types) {
            if (seatType.selected) {
                const type = seatType.type;

                for (const index of seatType.selected) {
                    const id = `${Math.floor(index / this.options.map.columns)}_${index % this.options.map.columns}`;
                    // add to shopping cart
                    this.addTodict(id, type);
                }
            }
        }

        this.updateCartObject();
    }

    /**
     * Initializes the type of seats that can be clicked and
     * the types of seat that can be added to the shopping cart
     * from the options object.
     * @private
     */
    private initializeSeatTypes(): void {
        // update types of seat
        this.types = ['available'];
        this.dict = {};

        for (const option of this.options.types) {
            this.types.push(option.type);
            this.dict[option.type] = [];
        }
    }

    /**
     * Converts a seat id to an index.
     * @param {string} id - Seat id to map.
     * @returns {number} Seat index.
     * @private
     */
    private getIndexFromId(id: string): number {
        const values = id.split('_').map(val => parseInt(val, 10));

        return (this.options.map.columns * values[0]) + values[1];
    }

    /**
     * Creates a shopping cart item.
     * @param {Seat} seat - Seat info.
     * @returns {HTMLDivElement} The shopping cart item.
     * @private
     */
    private createCartItem(seat: Seat): HTMLDivElement {
        if (!seat.price) {
            throw new Error('Seat price cannot be null or undefined.');
        }

        const item = document.createElement('tr');

        const ticketTd = document.createElement('td');
        ticketTd.className = 'sc-ticket-container';

        const ticket = this.createTicket(seat);
        ticketTd.appendChild(ticket);

        const seatPrice = document.createElement('td');
        const currency = this.options.cart?.currency || DEFAULT_CURRENCY;
        seatPrice.textContent = `${currency}${seat.price.toFixed(2)}`;

        const deleteTd = document.createElement('td');
        const deleteBtn = this.createScDeleteButton();
        deleteBtn.onclick = this.deleteClick(item);

        deleteTd.appendChild(deleteBtn);

        item.setAttribute('id', `item-${seat.id}`);
        item.appendChild(ticketTd);
        item.appendChild(seatPrice);
        item.appendChild(deleteTd);

        return item;
    }

    /**
     * Empties an html element if it has any child.
     * @param {HTMLElement} el - Element.
     * @private
     */
    private emptyElement(el: HTMLElement): void {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    }
}

export default Cart;
