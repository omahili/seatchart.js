import Cart from 'components/cart';
import Legend from 'components/legend';
import InvalidParameterError from 'errors/invalid-parameter-error';
import NotFoundError from 'errors/not-found-error';
import { DEFAULT_TEXT_COLOR } from 'utils/consts';
import { ChangeEvent, ClearEvent } from 'utils/events';
import Options from 'utils/options';
import Seat from 'utils/seat';
import utils from 'utils/utils';
import Validator from 'utils/validator';

/**
 * Callback to generate a seat name.
 *
 * @function seatNameCallback
 *
 * @param {object} row
 * @param {number} row.index - Row index (starts from 0).
 * @param {boolean} row.disabled - True if current row is disabled.
 * @param {number} row.disabledCount - Number of disabled rows till that one (including current one if disabled).
 *
 * @param {object} column
 * @param {number} column.index - Column index (starts from 0).
 * @param {boolean} column.disabled - True if current column is disabled.
 * @param {number} column.disabledCount - Number of disabled columns till that one (including current one if disabled).
 *
 * @returns {string} Seat name. Return null or undefined if empty.
 */

/**
 * Callback to generate a row name.
 *
 * @function rowNameCallback
 *
 * @param {number} index - Row index (starts from 0).
 * @param {boolean} disabled - True if current row is disabled.
 * @param {number} disabledCount - Number of disabled rows till that one (including current one if disabled).
 *
 * @returns {string} Row name. Return null or undefined if empty.
 */

/**
 * Callback to generate a column name.
 *
 * @function columnNameCallback
 *
 * @param {number} index - Column index (starts from 0).
 * @param {boolean} disabled - True if current column is disabled.
 * @param {number} disabledCount - Number of disabled columns till that one (including current one if disabled).
 *
 * @returns {string} Column name. Return null or undefined if empty.
 *
 */

/**
 * @typedef {Object} Seat
 * @property {string} type - Seat type.
 * @property {number} id - Seat id.
 * @property {number} index - Seat index.
 * @property {string} name - Seat name.
 * @property {number} price - Seat price.
 */

/**
 * @typedef {Array.<Object>} ClearEvent
 * @property {Seat} current - Current seat info.
 * @property {Seat} previous - Seat info previous to the event.
 */

/**
 * @typedef {Object} ChangeEvent
 * @property {string} action - Action on seat ('add', 'remove' or 'update').
 * @property {Seat} current - Current seat info.
 * @property {Seat} previous - Seat info previous to the event.
 */

class Seatchart {
    public readonly options: Options;

    /**
     * Triggered when a seat is selected or unselected.
     *
     * @method
     * @param {ChangeEvent} e - A change event.
     * @listens ChangeEvent
     */
    public onChange: ((e: ChangeEvent) => void) | undefined;

    /**
     * Triggered when all seats are removed with the 'delete all' button in the shopping cart.
     *
     * @method
     * @param {ClearEvent} e - A clear event.
     * @listens ClearEvent
     */
    public onClear: ((e: ClearEvent) => void) | undefined;

    /**
     * A string containing all the letters of the english alphabet.
     * @type {string}
     * @private
     */
    private alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    /**
     * An array of strings containing all the pickable seat types, "available" included.
     * @type {Array.<string>}
     * @private
     */
    private types: string[] = [];

    private cart: Cart;
    private legend: Legend;

    /**
     * Creates a seatchart.
     * @constructor
     *
     * @param {Object} options - Seatmap options.
     *
     *
     * @param {Object} options.map - Map options.
     * @param {string} options.map.id - Container id.
     * @param {number} options.map.rows - Number of rows.
     * @param {number} options.map.columns - Number of columns.
     * @param {seatNameCallback} [options.map.seatName] - Seat name generator.
     *
     * @param {Object} [options.map.reserved] - Array of reserved seats.
     * @param {Array.<number>} [options.map.reserved.seats] - Array of the reserved seats.
     *
     * @param {Object} [options.map.disabled] - Disabled seats options.
     * @param {Array.<number>} [options.map.disabled.seats] - Array of the disabled seats.
     * @param {Array.<number>} [options.map.disabled.rows] - Array of the disabled rows of seats.
     *
     * @param {Array.<number>} [options.map.disabled.columns] - Array of the disabled columns of seats.
     *
     * @param {Object} [options.map.indexes] - Indexes options.
     *
     * @param {Object} [options.map.indexes.rows] - Rows index options.
     * @param {boolean} [options.map.indexes.rows.visible = true] - Row index visibility.
     * @param {string} [options.map.indexes.rows.position = left] - Row index position.
     * @param {rowNameCallback} [options.map.indexes.rows.name] - Row name generator.
     *
     * @param {Object} [options.map.indexes.columns] - Columns index options.
     * @param {boolean} [options.map.indexes.columns.visible = true] - Column index visibility.
     * @param {string} [options.map.indexes.columns.position = top] - Column index position.
     * @param {columnNameCallback} [options.map.indexes.columns.name] - Column name generator.
     *
     * @param {Object} [options.map.front] - Front header options.
     * @param {boolean} [options.map.front.visible = true] - Front header visibility.
     *
     *
     * @param {Array.<Object>} options.types - Seat types options.
     * @param {string} options.types.type - Name of seat type.
     * @param {string} options.types.backgroundColor - Background color of the defined seat type.
     * @param {number} options.types.price - Price of the defined seat type.
     * @param {string} [options.types.textColor = white] - Text color of the defined seat type.
     * @param {Array.<number>} [options.types.selected] - Selected seats of the defined seat type.
     *
     *
     * @param {Array.<Object>} [options.cart] - Cart options.
     * @param {string} options.cart.id - Container id.
     * @param {string} [options.cart.height] - Cart height.
     * @param {string} [options.cart.width] - Cart width.
     * @param {string} [options.cart.currency = €] - Current currency.
     *
     *
     * @param {string} [options.legend] - Legend options.
     * @param {string} options.legend.id - Container id.
     *
     *
     * @param {Array.<Object>} [options.assets] - Assets options.
     * @param {string} [options.assets.path] - Path to assets.
     *
     * @alias Seatchart
     *
     */
    constructor(options: Options) {
        this.options = options;

        Validator.validate(options);

        this.rowName = this.rowName.bind(this);
        this.columnName = this.columnName.bind(this);
        this.seatName = this.seatName.bind(this);
        this.types = ['available', ...this.options.types.map((x) => x.type)];

        this.createMap();

        this.cart = new Cart(this);
        this.legend = new Legend(this);
    }

    /**
     * Checks whether a seat is a gap or not.
     * @param {number} seatIndex - Seat index.
     * @returns {boolean} True if it is, false otherwise.
     */
    public isGap(seatIndex: number): boolean {
        if (typeof seatIndex !== 'number' && Math.floor(seatIndex) === seatIndex) {
            throw new InvalidParameterError('Invalid parameter \'seatIndex\' supplied to Seatchart.isGap(). It must be an integer.');
        } else if (seatIndex >= this.options.map.rows * this.options.map.columns) {
            throw new InvalidParameterError('Invalid parameter \'seatIndex\' supplied to Seatchart.isGap(). Index is out of range.');
        }

        const row = Math.floor(seatIndex / this.options.map.columns);
        const col = seatIndex % this.options.map.columns;

        const seatId = `${row}_${col}`;

        // if current seat is disabled or reserved do not continue
        if ((this.options.map.disabled?.seats && this.options.map.disabled.seats.indexOf(seatIndex) >= 0) ||
            (this.options.map.disabled?.columns && this.options.map.disabled.columns.indexOf(col) >= 0) ||
            (this.options.map.disabled?.rows && this.options.map.disabled.rows.indexOf(row) >= 0) ||
            (this.options.map.reserved?.seats && this.options.map.reserved.seats.indexOf(seatIndex) >= 0)
        ) {
            return false;
        }

        const keys = Object.keys(this.cart.dict);

        // if current seat is selected do not continue
        for (const key of keys) {
            if (this.cart.dict[key].indexOf(seatId) >= 0) {
                return false;
            }
        }

        const colBefore = col - 1;
        const colAfter = col + 1;

        const seatBefore = seatIndex - 1;
        const seatAfter = seatIndex + 1;

        const isSeatBeforeDisabled = this.options.map.disabled?.seats ?
            this.options.map.disabled.seats.indexOf(seatBefore) >= 0 :
            false;
        const isSeatAfterDisabled = this.options.map.disabled?.seats ?
            this.options.map.disabled.seats.indexOf(seatAfter) >= 0 :
            false;

        const isSeatBeforeReserved = this.options.map.reserved?.seats ?
            this.options.map.reserved.seats.indexOf(seatBefore) >= 0 :
            false;
        const isSeatAfterReserved = this.options.map.reserved?.seats ?
            this.options.map.reserved.seats.indexOf(seatAfter) >= 0 :
            false;

        // if there's a disabled/reserved block before and after do not consider it a gap
        if ((isSeatBeforeDisabled && isSeatAfterDisabled) ||
            (isSeatBeforeReserved && isSeatAfterReserved) ||
            (isSeatBeforeReserved && isSeatAfterDisabled) ||
            (isSeatBeforeDisabled && isSeatAfterReserved)) {
            return false;
        }

        // if there's a disabled/reserved block before and no seats after because the seatchart ends or,
        // a disabled/reserved block after and no seats before, then do not consider it a gap
        if (((isSeatBeforeDisabled || isSeatBeforeReserved) && colAfter >= this.options.map.columns) ||
            (colBefore < 0 && (isSeatAfterDisabled || isSeatAfterReserved))) {
            return false;
        }

        const seatBeforeId = `${row}_${colBefore}`;
        const seatAfterId = `${row}_${colAfter}`;

        let isSeatBeforeSelected = false;
        let isSeatAfterSelected = false;

        // check if seat before and after are selected
        for (const type of keys) {
            if (!isSeatBeforeSelected) {
                isSeatBeforeSelected = this.cart.dict[type].indexOf(seatBeforeId) >= 0;
            }

            if (!isSeatAfterSelected) {
                isSeatAfterSelected = this.cart.dict[type].indexOf(seatAfterId) >= 0;
            }

            if (isSeatAfterSelected && isSeatBeforeSelected) {
                break;
            }
        }

        const isSeatBeforeUnavailable = colBefore < 0 ||
            (this.options.map.reserved?.seats && this.options.map.reserved.seats.indexOf(seatBefore) >= 0) ||
            isSeatBeforeDisabled ||
            isSeatBeforeSelected;

        const isSeatAfterUnavailable = colAfter >= this.options.map.columns ||
            (this.options.map.reserved?.seats && this.options.map.reserved.seats.indexOf(seatAfter) >= 0) ||
            isSeatAfterDisabled ||
            isSeatAfterSelected;

        return isSeatBeforeUnavailable && isSeatAfterUnavailable;
    }

    /**
     * Checks whether a seat creates a gap or not.
     * @param {number} seatIndex - Seat index.
     * @returns {boolean} True if it does, false otherwise.
     */
    public makesGap(seatIndex: number): boolean {
        if (typeof seatIndex !== 'number' && Math.floor(seatIndex) === seatIndex) {
            throw new InvalidParameterError('Invalid parameter \'seatIndex\' supplied to Seatchart.makesGap(). ' +
                'It must be an integer.',
            );
        } else if (seatIndex >= this.options.map.rows * this.options.map.columns) {
            throw new InvalidParameterError('Invalid parameter \'seatIndex\' supplied to Seatchart.makesGap(). ' +
                'Index is out of range.',
            );
        }

        const col = seatIndex % this.options.map.columns;

        let isSeatBeforeGap = false;
        if (seatIndex - 1 >= 0 && col > 0) {
            isSeatBeforeGap = this.isGap(seatIndex - 1);
        }

        let isSeatAfterGap = false;
        if ((seatIndex + 1 < this.options.map.columns * this.options.map.rows) &&
            (col + 1 < this.options.map.columns)) {
            isSeatAfterGap = this.isGap(seatIndex + 1);
        }

        return isSeatBeforeGap || isSeatAfterGap;
    }

    /**
     * Gets all seats which represent a gap of the seat map.
     * @returns {Array.<number>} Array of indexes.
     */
    public getGaps(): number[] {
        const gaps = [];
        const count = this.options.map.columns * this.options.map.rows;
        for (let i = 0; i < count; i += 1) {
            if (this.isGap(i)) {
                gaps.push(i);
            }
        }

        return gaps;
    }

    /**
     * Gets seat info.
     * @param {number} index - Seat index.
     * @returns {Seat} Seat info.
     */
    public get(index: number): Seat {
        if (typeof index !== 'number' && Math.floor(index) === index) {
            throw new InvalidParameterError('Invalid parameter \'index\' supplied to Seatchart.get(). It must be an integer.');
        } else if (index >= this.options.map.rows * this.options.map.columns) {
            throw new InvalidParameterError('Invalid parameter \'index\' supplied to Seatchart.get(). Index is out of range.');
        }

        if (index < this.options.map.rows * this.options.map.columns) {
            const row = Math.floor(index / this.options.map.columns);
            const col = index % this.options.map.columns;
            const seatId = `${row}_${col}`;
            const name = this.getSeatName(seatId);

            // check if seat is reserved
            if (this.options.map.reserved?.seats && this.options.map.reserved.seats.indexOf(index) >= 0) {
                return {
                    id: seatId,
                    index,
                    name,
                    price: null,
                    type: 'reserved',
                };
            }

            // check if seat is reserved
            if (this.options.map.disabled?.seats && this.options.map.disabled.seats.indexOf(index) >= 0) {
                return {
                    id: seatId,
                    index,
                    name,
                    price: null,
                    type: 'disabled',
                };
            }

            const keys = Object.keys(this.cart.dict);

            // check if seat is already selected
            for (const type of keys) {
                const price = this.cart.getPrice(type);
                if (this.cart.dict[type].indexOf(seatId) >= 0) {
                    return {
                        id: seatId,
                        index,
                        name,
                        price,
                        type,
                    };
                }
            }

            return {
                id: seatId,
                index,
                name,
                price: null,
                type: 'available',
            };
        }

        throw new InvalidParameterError('Invalid parameter \'index\' supplied to Seatchart.get(). Index is out of range.');
    }

    /**
     * Set seat type.
     * @param {number} index - Index of the seat to update.
     * @param {string} type - New seat type ('disabled', 'reserved' and 'available' are supported too).
     * @param {boolean} [emit = false] - True to trigger onChange event.
     */
    public set(index: number, type: string, emit: boolean) {
        let seatType;
        if (typeof index !== 'number' && Math.floor(index) === index) {
            throw new InvalidParameterError('Invalid parameter \'index\' supplied to Seatchart.set(). It must be an integer.');
        } else if (index >= this.options.map.rows * this.options.map.columns) {
            throw new InvalidParameterError('Invalid parameter \'index\' supplied to Seatchart.set(). Index is out of range.');
        } else if (typeof type !== 'string') {
            throw new InvalidParameterError('Invalid parameter \'type\' supplied to Seatchart.set(). It must be a string.');
        } else {
            seatType = this.options.types.find((x) => x.type === type);

            // check if type is valid
            if (!seatType || ['available', 'reserved', 'disabled'].indexOf(type) < 0) {
                throw new InvalidParameterError('Invalid parameter \'type\' supplied to Seatchart.set().');
            } else if (emit && typeof emit !== 'boolean') {
                throw new InvalidParameterError('Invalid parameter \'emit\' supplied to Seatchart.set(). It must be a boolean.');
            }
        }

        const seat = this.get(index);
        if (!seat || seat.type === type) {
            return;
        }

        const classes: { [key: string]: string } = {
            disabled: 'sc-blank',
            reserved: 'sc-unavailable',
        };

        const element = document.getElementById(seat.id);
        if (element) {
            if (seat.type === 'disabled' || seat.type === 'reserved') {
                const seats = this.options.map[seat.type]?.seats;
                const arrayIndex = seats && seats.indexOf(index);
                if (seats && arrayIndex && arrayIndex >= 0) {
                    seats.splice(arrayIndex, 1);
                }
            }

            if ((type === 'reserved' || type === 'disabled') && this.options.map[type]?.seats) {
                this.options.map[type]?.seats.push(index);
            }

            if (seat.type !== 'available' && seat.type !== 'disabled' && seat.type !== 'reserved') {
                if (type !== 'available' && type !== 'disabled' && type !== 'reserved') {
                    if (this.cart.removeFromdict(seat.id, seat.type) && this.cart.addTodict(seat.id, type)) {
                        element.classList.add('clicked');
                        element.style.setProperty('background-color', seatType.backgroundColor);
                        element.style.setProperty('color', seatType.textColor || DEFAULT_TEXT_COLOR);
                        this.cart.updateCart('update', seat.id, type, seat.type, emit);
                    }
                } else if (this.cart.removeFromdict(seat.id, seat.type)) {
                    element.classList.remove('clicked');
                    element.style.removeProperty('background-color');
                    this.cart.updateCart('remove', seat.id, type, seat.type, emit);
                }
            } else if (type !== 'available' && type !== 'disabled' && type !== 'reserved') {
                if (this.cart.addTodict(seat.id, type)) {
                    element.classList.add('clicked');
                    element.style.setProperty('background-color', seatType.backgroundColor);
                    element.style.setProperty('color', seatType.textColor || DEFAULT_TEXT_COLOR);
                    this.cart.updateCart('add', seat.id, type, seat.type, emit);
                }
            }

            this.types.forEach((x) => classes[x] = x);

            element.classList.add(classes[type]);
            element.classList.remove(classes[seat.type]);
        }

        this.cart.updateTotal();
    }

    /**
     * Gets the name of a seat.
     * @param {string} id - The dom id of the seat in the seatmap.
     * @returns {string} The name.
     */
    public getSeatName(id: string): string {
        const element = document.getElementById(id);
        if (element?.textContent) {
            return element.textContent;
        }

        throw new NotFoundError('Seat name not found.');
    }

    /**
     * Gets the type of a seat.
     * @param {string} id - The dom id of the seat in the seatmap.
     * @returns {string} The type.
     */
    public getSeatType(id: string): string {
        const keys = Object.keys(this.cart.dict);
        for (const key of keys) {
            if (this.cart.dict[key].indexOf(id) >= 0) {
                return key;
            }
        }

        throw new NotFoundError('Seat type not found.');
    }

    /**
     * Makes a seat available,
     * @param {string} id - The dom id of the seat in the seatmap.
     */
    public releaseSeat(id: string): void {
        const seat = document.getElementById(id);

        if (seat) {
            seat.style.cssText = '';
            seat.className = 'sc-seat available';
        }
    }

    /**
     * Computes the style of an element, it works even on ie :P.
     * @param {Element} el - The element for which we're getting the computed style.
     * @returns {CSSStyleDeclaration} The css of the element.
     * @private
     */
    private getStyle(el: Element): CSSStyleDeclaration {
        return window.getComputedStyle(el);
    }

    /**
     * This function is fired when a seat is clicked in the seatmap.
     * @private
     */
    private seatClick(seat: HTMLElement): () => void {
        return () => {
            // clone array because it's modified by adding and removing classes
            const currentClassList: string[] = [];
            seat.classList.forEach((x) => currentClassList.push(x));

            for (const currentClass of currentClassList) {
                let newClass;

                if (currentClass !== 'sc-seat' && currentClass !== 'clicked') {
                    // find index of current
                    let index = this.types.indexOf(currentClass);

                    // if the current class matches a type
                    // then select the new one
                    if (index !== -1) {
                        seat.classList.remove(this.types[index]);
                        index += 1;

                        if (index === this.types.length) {
                            index = 0;
                        }

                        newClass = this.types[index];

                        seat.style.backgroundColor = '';
                        seat.style.color = '';
                        seat.classList.add(newClass);

                        // if the class isn't available then apply the background-color in the config
                        if (newClass !== 'available') {
                            // decrease it because there's one less element in options.types
                            // which is 'available', that already exists
                            index -= 1;
                            if (index < 0) {
                                index = this.options.types.length - 1;
                            }

                            seat.classList.add('clicked');
                            seat.style.backgroundColor = this.options.types[index].backgroundColor;
                            seat.style.color = this.options.types[index].textColor || DEFAULT_TEXT_COLOR;
                        } else {
                            // otherwise remove the class 'clicked'
                            // since available has it's own style
                            seat.classList.remove('clicked');
                        }

                        // this has to be done after updating the shopping cart
                        // so the event is fired just once the seat style is really updated
                        if (currentClass === 'available') {
                            if (this.cart.addTodict(seat.id, newClass)) {
                                this.cart.updateCart('add', seat.id, newClass, currentClass, true);
                            }
                        } else if (newClass === 'available') {
                            if (this.cart.removeFromdict(seat.id, currentClass)) {
                                this.cart.updateCart('remove', seat.id, newClass, currentClass, true);
                            }
                        } else if (this.cart.addTodict(seat.id, newClass) &&
                            this.cart.removeFromdict(seat.id, currentClass)) {
                            this.cart.updateCart('update', seat.id, newClass, currentClass, true);
                        }
                    }
                }
            }

            this.cart.updateTotal();
        };
    }

    /**
     * This function is fired when a seat is right clicked to be released.
     * @private
     */
    private rightClickDelete(seat: HTMLElement): (e: Event) => void {
        return (e: Event) => {
            e.preventDefault();

            try {
                const type = this.getSeatType(seat.id);

                // it means it has no type and it's available, then there's nothing to delete
                if (type !== undefined) {
                    this.releaseSeat(seat.id);
                    // remove from virtual sc
                    this.cart.removeFromdict(seat.id, type);

                    // there's no need to fire onChange event since this function fires
                    // the event after removing the seat from shopping cart
                    this.cart.updateCart('remove', seat.id, 'available', type, true);
                    this.cart.updateTotal();
                }

                // so the default context menu isn't showed
                return false;
            } catch (e) {
                if (e instanceof NotFoundError) {
                    return false;
                }

                throw e;
            }
        };
    }

    /**
     * Generates a row name.
     * @param {number} row - Row index (starts from 0).
     * @param {boolean} disabled - True if current row is disabled.
     * @param {number} disabledCount - Number of disabled rows till that one (including current one if disabled).
     * @returns {string} Row name. Return null or undefined if empty.
     * @private
     */
    private rowName(index: number, disabled: boolean, disabledCount: number): string | undefined {
        if (!disabled) {
            return this.alphabet[index - disabledCount];
        }
    }

    /**
     * Generates a column name.
     * @param {number} column - Column index (starts from 0).
     * @param {boolean} disabled - True if current column is disabled.
     * @param {number} disabledCount - Number of disabled columns till that one (including current one if disabled).
     * @returns {string} Column name. Return null or undefined if empty.
     * @private
     */
    private columnName(index: number, disabled: boolean, disabledCount: number): string | undefined {
        if (!disabled) {
            return ((index - disabledCount) + 1).toString();
        }
    }

    /**
     * Generates a seat name.
     * @param {object} row
     * @param {number} row.index - Row index (starts from 0).
     * @param {boolean} row.disabled - True if current row is disabled.
     * @param {number} row.disabledCount - Number of disabled rows till that one (including current one if disabled).
     *
     * @param {object} column
     * @param {number} column.index - Column index (starts from 0).
     * @param {boolean} column.disabled - True if current column is disabled.
     * @param {number} column.disabledCount - Number of disabled columns till that one
     * (including current one if disabled).
     *
     * @returns {string} Seat name. Return null if empty.
     * @private
     */
    private seatName(
        row: { index: number, disabled: boolean, disabledCount: number },
        column: { index: number, disabled: boolean, disabledCount: number },
    ): string | undefined {
        if (!row.disabled && !column.disabled) {
            const rowIndex = this.rowName(row.index, row.disabled, row.disabledCount);
            const columnIndex = this.columnName(column.index, column.disabled, column.disabledCount);

            return `${rowIndex}${columnIndex}`;
        }
    }

    /**
     * Creates a new seat.
     * @param {string} type - The type of the seat.
     * @param {string} content - The name representing the seat.
     * @param {string} seatId - The dom id of the seat in the seatmap.
     * @returns {HTMLDivElement} The seat.
     * @private
     */
    private createSeat(type: string, content: string | undefined, seatId: string): HTMLDivElement {
        const seat = document.createElement('div');
        seat.className = 'sc-seat ' + type;
        if (content) {
            seat.textContent = content;
        }

        // if seatId wasn't passed as argument then don't set it
        if (seatId !== undefined) {
            seat.setAttribute('id', seatId);

            // add click event just if it's a real seats (when it has and id)
            seat.addEventListener('click', this.seatClick(seat));
            seat.addEventListener('contextmenu', this.rightClickDelete(seat), false);
        }

        return seat;
    }

    /**
     * Creates a seat map row.
     * @returns {HTMLDivElement} The row.
     * @private
     */
    private createRow(): HTMLDivElement {
        const row = document.createElement('div');
        row.className = 'sc-map-row';

        return row;
    }

    /**
     * Creates the header of the seatmap containing the front indicator.
     * @returns {HTMLDivElement} The seatmap header.
     * @private
     */
    private createFrontHeader(): HTMLDivElement {
        // set the perfect width of the front indicator
        const front = document.createElement('div');
        front.textContent = 'Front';
        front.className = 'sc-front';

        return front;
    }

    /**
     * Creates a seatmap index.
     * @param {string} content - Index text content.
     * @returns {HTMLDivElement} The seatmap index.
     * @private
     */
    private createIndex(content: string): HTMLDivElement {
        const index = document.createElement('div');
        index.textContent = content;
        index.className = 'sc-index';

        return index;
    }

    /**
     * Creates a seatmap blank spot.
     * @returns {HTMLDivElement} The seatmap blank spot.
     * @private
     */
    private createBlank(): HTMLDivElement {
        const blank = document.createElement('div');
        blank.className = 'sc-seat blank';

        return blank;
    }

    /**
     * Creates a row containing all the row indexes.
     * @returns {HTMLDivElement} Row indexes.
     * @private
     */
    private createRowIndex(): HTMLDivElement {
        const rowIndex = document.createElement('div');
        rowIndex.className = 'sc-row-index';

        const disabled = this.options.map.disabled;
        let disabledCount = 0;

        let generateName = this.rowName;
        if (this.options.map.indexes?.rows?.name) {
            generateName = this.options.map.indexes.rows.name;
        }

        for (let i = 0; i < this.options.map.rows; i += 1) {
            const isRowDisabled = disabled && disabled.rows ? disabled.rows.indexOf(i) >= 0 : false;
            disabledCount = isRowDisabled ? disabledCount + 1 : disabledCount;

            const index = generateName(i, isRowDisabled, disabledCount);

            if (index) {
                rowIndex.appendChild(this.createIndex(index));
            } else {
                rowIndex.appendChild(this.createBlank());
            }
        }

        return rowIndex;
    }

    /**
     * Creates a row containing all the column indexes.
     * @returns {HTMLDivElement} Column indexes.
     * @private
     */
    private createColumnIndex(): HTMLDivElement {
        const columnIndex = document.createElement('div');
        columnIndex.className = 'sc-column-index';

        const disabled = this.options.map.disabled;
        let disabledCount = 0;

        let generateName = this.columnName;
        if (this.options.map.indexes?.columns?.name) {
            generateName = this.options.map.indexes.columns.name;
        }

        for (let i = 0; i < this.options.map.columns; i += 1) {
            const isColumnDisabled = (disabled?.columns && disabled.columns.indexOf(i) >= 0) || false;
            disabledCount = isColumnDisabled ? disabledCount + 1 : disabledCount;

            const index = generateName(i, isColumnDisabled, disabledCount);
            if (index) {
                columnIndex.appendChild(this.createIndex(index));
            } else {
                columnIndex.appendChild(this.createBlank());
            }
        }

        return columnIndex;
    }

    /**
     * Removes all classes regarding the type applied to the seat.
     * @param {HTMLDivElement} seat - Seat element.
     * @private
     */
    private removeAllTypesApplied(seat: HTMLDivElement) {
        for (const type of this.types) {
            seat.classList.remove(type);
        }
    }

    /**
     * Add to options each seat from disabled columns and rows.
     * @private
     */
    private addDisabledSeatsToOptions(): void {
        if (!this.options.map.disabled) {
            this.options.map.disabled = {};
        }

        if (!this.options.map.disabled?.seats) {
            this.options.map.disabled.seats = [];
        }

        // add disabled columns to disabled array
        const disabledColumns = this.options.map.disabled?.columns;
        if (disabledColumns) {
            for (const disabledColumn of disabledColumns) {
                for (let r = 0; r < this.options.map.rows; r += 1) {
                    this.options.map.disabled.seats.push((this.options.map.columns * r) + disabledColumn);
                }
            }
        }

        // add disabled rows to disabled array
        const disabledRows = this.options.map.disabled?.rows;
        if (disabledRows) {
            for (const disabledRow of disabledRows) {
                for (let c = 0; c < this.options.map.columns; c += 1) {
                    this.options.map.disabled.seats.push((this.options.map.columns * disabledRow) + c);
                }
            }
        }
    }

    /**
     * Disables and reserves all seats given in the options.
     * @private
     */
    private disableAndReserveSeats(): void {
        const types: ('reserved' | 'disabled')[] = ['reserved', 'disabled'];

        for (const type of types) {
            const seats = this.options.map[type]?.seats;
            if (seats) {
                const columns = this.options.map.columns;

                for (const index of seats) {
                    const id = `${Math.floor(index / columns)}_${index % columns}`;
                    const seat = <HTMLDivElement> document.getElementById(id);

                    if (seat != null) {
                        this.removeAllTypesApplied(seat);

                        if (type === 'disabled') {
                            seat.classList.add('blank');
                        } else if (type === 'reserved') {
                            seat.classList.add('unavailable');
                        }
                    }
                }
            }
        }
    }

    /**
     * Selects seats given with seat types.
     * @private
     */
    private selectSeats(): void {
        for (const seatType of this.options.types) {
            if (seatType.selected) {
                const type = seatType.type;
                const backgroundColor = seatType.backgroundColor;
                const color = seatType.textColor || DEFAULT_TEXT_COLOR;

                for (const index of seatType.selected) {
                    const id = `${Math.floor(index / this.options.map.columns)}_${index % this.options.map.columns}`;

                    const element = document.getElementById(id);
                    if (element) {
                        // set background
                        element.classList.remove('available');
                        element.classList.add(type);
                        element.classList.add('clicked');
                        element.style.backgroundColor = backgroundColor;
                        element.style.color = color;
                    }
                }
            }
        }
    }

    /**
     * Creates the seatmap.
     * @private
     */
    private createMap(): void {
        const map = document.createElement('div');
        map.classList.add('sc-map');

        const disabled = this.options.map.disabled;
        let disabledRowsCounter = 0;

        const generateName = this.options.map.seatName || this.seatName;

        // add rows containing seats
        for (let i = 0; i < this.options.map.rows; i += 1) {
            const row = this.createRow();

            const isRowDisabled = disabled?.rows ? disabled.rows.indexOf(i) >= 0 : false;
            disabledRowsCounter = isRowDisabled ? disabledRowsCounter + 1 : disabledRowsCounter;

            let disabledColumnsCounter = 0;

            for (let j = 0; j < this.options.map.columns; j += 1) {
                const isColumnDisabled = disabled?.columns ? disabled.columns.indexOf(j) >= 0 : false;
                disabledColumnsCounter = isColumnDisabled ? disabledColumnsCounter + 1 : disabledColumnsCounter;

                const seatTextContent = generateName(
                    { index: i, disabled: isRowDisabled, disabledCount: disabledRowsCounter },
                    { index: j, disabled: isColumnDisabled, disabledCount: disabledColumnsCounter },
                );

                // draw empty row if row is disabled,
                // while draw blank seat if column is disabled
                row.appendChild(this.createSeat('available', seatTextContent, `${i}_${j}`));
            }

            map.appendChild(row);
        }

        const indexes = this.options.map.indexes;
        const front = this.options.map.front;

        let columnContainerDirection = 'column';
        if (indexes?.columns?.position === 'bottom') {
            columnContainerDirection = 'column-reverse';
        }

        let itemsPosition = 'right';
        let rowContainerDirection = 'row';
        if (indexes?.rows?.position === 'right') {
            rowContainerDirection = 'row-reverse';
            itemsPosition = 'left';
        }

        const rowIndexContainer = utils.DOM.createContainer(null, rowContainerDirection);
        const columnIndexContainer = utils.DOM.createContainer(null, columnContainerDirection, itemsPosition);
        columnIndexContainer.append(rowIndexContainer);

        // create map container which will contain everything
        const mapContainer = utils.DOM.createContainer('map', 'column', itemsPosition);

        const frontHeader = this.createFrontHeader();
        if (!front || front.visible === undefined || front.visible) {
            frontHeader.classList.add('sc-margin-bottom');
            mapContainer.appendChild(frontHeader);
        }

        if (!indexes || !indexes.columns || indexes.columns.visible === undefined || indexes.columns.visible) {
            columnIndexContainer.appendChild(this.createColumnIndex());
        }

        if (!indexes || !indexes.rows || indexes.rows.visible === undefined || indexes.rows.visible) {
            rowIndexContainer.appendChild(this.createRowIndex());
        }

        rowIndexContainer.append(map);
        columnIndexContainer.append(rowIndexContainer);
        mapContainer.append(columnIndexContainer);

        const seatmap = document.getElementById(this.options.map.id);
        if (seatmap) {
            seatmap.appendChild(mapContainer);
        }

        const seat = <HTMLElement> document.getElementsByClassName('sc-seat')[0];
        const width = seat.offsetWidth;

        const computedStyle = this.getStyle(seat);
        const margins = parseInt(computedStyle.marginLeft, 10) +
            parseInt(computedStyle.marginRight, 10);

        const mapWidth = (width + margins) * this.options.map.columns;

        // set front header and map width
        map.style.width = `${mapWidth}px`;

        if (!front || front.visible === undefined || front.visible) {
            frontHeader.style.width = `${mapWidth}px`;
        }

        this.addDisabledSeatsToOptions();
        this.disableAndReserveSeats();
        this.selectSeats();
    }
}

export default Seatchart;
