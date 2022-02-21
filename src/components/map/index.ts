import CartUI from 'components/cart';
import InvalidParameterError from 'errors/invalid-parameter-error';
import NotFoundError from 'errors/not-found-error';
import { DEFAULT_TEXT_COLOR } from 'utils/consts';
import { Options } from 'types/options';
import { SeatInfo } from 'types/seat-info';
import Validator from 'utils/validator';
import { EventListener } from 'types/events';
import LegendUI from 'components/legend';
import ContainerUI from 'components/common/container.ui';
import SeatUI from 'components/map/seat.ui';
import MapRowUI from 'components/map/row.ui';
import MapFrontHeaderUI from 'components/map/front-header.ui';
import MapIndexUI from 'components/map/map-index.ui';
import GapDetection from 'components/map/gap-detection.service';

/**
 * @internal
 */
class MapUI {
    public readonly options: Options;
    public readonly cart: CartUI;
    public readonly legend: LegendUI;

    /**
     * Array of listeners triggered when a seat is selected or unselected.
     */
    public onChangeEventListeners: Array<EventListener> = [];

    /**
     * Array of listeners triggered when all seats are removed with the 'delete all' button in the shopping cart.
     */
    public onClearEventListeners: Array<EventListener> = [];

    private gapDetection: GapDetection;

    /**
     * A string containing all the letters of the english alphabet.
     */
    private alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    /**
     * An array of strings containing all the pickable seat types, "available" included.
     */
    private types: string[] = [];

    /**
     * Creates a map.
     * @param options - Seatmap options.
     */
    public constructor(options: Options) {
        this.options = options;

        Validator.validate(options);

        this.types = ['available', ...this.options.types.map(x => x.type)];
        this.createMap();

        this.cart = new CartUI(this);
        this.legend = new LegendUI(options);

        this.gapDetection = new GapDetection(
            this.options.map.rows,
            this.options.map.columns,
            this.cart.dict,
            this.options.map.disabled?.seats,
            this.options.map.disabled?.rows,
            this.options.map.disabled?.columns,
            this.options.map.reserved?.seats,
        );
    }

    /**
     * Adds an event listener.
     * @param type - Event type.
     * @param listener - Function called when the given event occurs.
     */
    public addEventListener(type: 'clear' | 'change', listener: EventListener): void {
        if (type === 'change') {
            this.onChangeEventListeners.push(listener);
        } else if (type === 'clear') {
            this.onClearEventListeners.push(listener);
        } else {
            throw new InvalidParameterError('Invalid parameter \'type\' supplied to Seatchart.addEventListener(). ' +
                'Type does not exist',
            );
        }
    }

    /**
     * Removes an event listener.
     * @param type - Event type.
     * @param listener - Listener to remove.
     */
    public removeEventListener(type: 'clear' | 'change', listener: EventListener): void {
        if (['change', 'clear'].includes(type)) {
            let eventListeners = type === 'change' ? this.onChangeEventListeners : this.onClearEventListeners;

            eventListeners.forEach((el: EventListener, i: number) => {
                if (el === listener) {
                    eventListeners = eventListeners.splice(i, 1);
                }
            });
        } else {
            throw new InvalidParameterError('Invalid parameter \'type\' supplied to Seatchart.removeEventListener(). ' +
                'Type does not exist',
            );
        }
    }

    /**
     * Checks whether a seat is a gap or not.
     * @param seatIndex - Seat index.
     * @returns True if it is, false otherwise.
     */
    public isGap(seatIndex: number): boolean {
        return this.gapDetection.isGap(seatIndex);
    }

    /**
     * Checks whether a seat creates a gap or not.
     * @param seatIndex - Seat index.
     * @returns True if it does, false otherwise.
     */
    public makesGap(seatIndex: number): boolean {
        return this.gapDetection.makesGap(seatIndex);
    }

    /**
     * Gets all seats which represent a gap of the seat map.
     * @returns Array of indexes.
     */
    public getGaps(): number[] {
        return this.gapDetection.getGaps();
    }

    /**
     * Gets seat info.
     * @param index - Seat index.
     * @returns Seat info.
     */
    public get(index: number): SeatInfo {
        if (typeof index !== 'number' && Math.floor(index) === index) {
            throw new InvalidParameterError(
                'Invalid parameter \'index\' supplied to Seatchart.get(). It must be an integer.'
            );
        } else if (index >= this.options.map.rows * this.options.map.columns) {
            throw new InvalidParameterError(
                'Invalid parameter \'index\' supplied to Seatchart.get(). Index is out of range.'
            );
        }

        if (index < this.options.map.rows * this.options.map.columns) {
            const row = Math.floor(index / this.options.map.columns);
            const col = index % this.options.map.columns;
            const seatId = `${row}_${col}`;
            const name = this.getSeatName(seatId);

            // check if seat is reserved
            if (this.options.map.reserved?.seats && this.options.map.reserved.seats.includes(index)) {
                return {
                    id: seatId,
                    index,
                    name,
                    price: null,
                    type: 'reserved',
                };
            }

            // check if seat is reserved
            if (this.options.map.disabled?.seats && this.options.map.disabled.seats.includes(index)) {
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
                const price = this.cart.getSeatPrice(type);
                if (this.cart.dict[type].includes(seatId)) {
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

        throw new InvalidParameterError(
            'Invalid parameter \'index\' supplied to Seatchart.get(). Index is out of range.'
        );
    }

    /**
     * Set seat type.
     * @param index - Index of the seat to update.
     * @param type - New seat type ('disabled', 'reserved' and 'available' are supported too).
     * @param emit - True to trigger onChangeListeners event (dafualt false).
     */
    public set(index: number, type: string, emit: boolean): void {
        let seatType;
        if (typeof index !== 'number' && Math.floor(index) === index) {
            throw new InvalidParameterError(
                'Invalid parameter \'index\' supplied to Seatchart.set(). It must be an integer.'
            );
        } else if (index >= this.options.map.rows * this.options.map.columns) {
            throw new InvalidParameterError(
                'Invalid parameter \'index\' supplied to Seatchart.set(). Index is out of range.'
            );
        } else if (typeof type !== 'string') {
            throw new InvalidParameterError(
                'Invalid parameter \'type\' supplied to Seatchart.set(). It must be a string.'
            );
        } else {
            seatType = this.options.types.find(x => x.type === type);

            // check if type is valid
            if (!seatType || !['available', 'reserved', 'disabled'].includes(type)) {
                throw new InvalidParameterError('Invalid parameter \'type\' supplied to Seatchart.set().');
            } else if (emit && typeof emit !== 'boolean') {
                throw new InvalidParameterError(
                    'Invalid parameter \'emit\' supplied to Seatchart.set(). It must be a boolean.'
                );
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

            if (type === 'reserved' || type === 'disabled') {
                this.options.map[type]?.seats?.push(index);
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

            this.types.forEach(x => classes[x] = x);

            element.classList.add(classes[type]);
            element.classList.remove(classes[seat.type]);
        }

        this.cart.updateTotal();
    }

    /**
     * Gets the name of a seat.
     * @param id - The dom id of the seat in the seatmap.
     * @returns The name.
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
     * @param id - The dom id of the seat in the seatmap.
     * @returns The type.
     */
    public getSeatType(id: string): string {
        const keys = Object.keys(this.cart.dict);
        for (const key of keys) {
            if (this.cart.dict[key].includes(id)) {
                return key;
            }
        }

        throw new NotFoundError('Seat type not found.');
    }

    /**
     * Makes a seat available,
     * @param id - The dom id of the seat in the seatmap.
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
     * @param el - The element for which we're getting the computed style.
     * @returns The css of the element.
     */
    private getStyle(el: Element): CSSStyleDeclaration {
        return window.getComputedStyle(el);
    }

    /**
     * This function is fired when a seat is clicked in the seatmap.
     */
    private seatClick(seat: HTMLElement): () => void {
        return (): void => {
            // clone array because it's modified by adding and removing classes
            const currentClassList: string[] = [];
            seat.classList.forEach(x => currentClassList.push(x));

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
     */
    private rightClickDelete(seat: HTMLElement): (e: Event) => void {
        return (e: Event): boolean => {
            e.preventDefault();

            try {
                const type = this.getSeatType(seat.id);

                // it means it has no type and it's available, then there's nothing to delete
                if (type !== undefined) {
                    this.releaseSeat(seat.id);
                    // remove from virtual sc
                    this.cart.removeFromdict(seat.id, type);

                    // there's no need to fire onChangeListeners event since this function fires
                    // the event after removing the seat from shopping cart
                    this.cart.updateCart('remove', seat.id, 'available', type, true);
                    this.cart.updateTotal();
                }

                // so the default context menu isn't showed
                return false;
            } catch (error) {
                if (error instanceof NotFoundError) {
                    return false;
                }

                throw e;
            }
        };
    }

    /**
     * Generates a row name.
     * @param row - Row index (starts from 0).
     * @param disabled - True if current row is disabled.
     * @param disabledCount - Number of disabled rows till that one (including current one if disabled).
     * @returns Row name. Returns null or undefined if empty.
     */
    private rowName(index: number, disabled: boolean, disabledCount: number): string | undefined {
        if (!disabled) {
            return this.alphabet[index - disabledCount];
        }
    }

    /**
     * Generates a column name.
     * @param column - Column index (starts from 0).
     * @param disabled - True if current column is disabled.
     * @param disabledCount - Number of disabled columns till that one (including current one if disabled).
     * @returns Column name. Returns null or undefined if empty.
     */
    private columnName(index: number, disabled: boolean, disabledCount: number): string | undefined {
        if (!disabled) {
            return ((index - disabledCount) + 1).toString();
        }
    }

    /**
     * Generates a seat name.
     * @param row - Row object.
     * @param column - Column object.
     * @returns Seat name. Returns null if empty.
     */
    private seatName(
        row: {
            /**
             * Row index (starts from 0).
             */
            index: number;
            /**
             * True if current row is disabled.
             */
            disabled: boolean;
            /**
             * Number of disabled rows till this one.
             */
            disabledCount: number;
        },
        column: {
            /**
             * Column index (starts from 0).
             */
            index: number;
            /**
             * True if current column is disabled.
             */
            disabled: boolean;
            /**
             * Number of disabled columns till this one.
             */
            disabledCount: number;
        },
    ): string | undefined {
        if (!row.disabled && !column.disabled) {
            const rowIndex = this.rowName(row.index, row.disabled, row.disabledCount);
            const columnIndex = this.columnName(column.index, column.disabled, column.disabledCount);

            return `${rowIndex}${columnIndex}`;
        }
    }

    /**
     * Removes all classes regarding the type applied to the seat.
     * @param seat - Seat element.
     */
    private removeAllTypesApplied(seat: HTMLDivElement): void {
        for (const type of this.types) {
            seat.classList.remove(type);
        }
    }

    /**
     * Add to options each seat from disabled columns and rows.
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
     */
    private disableAndReserveSeats(): void {
        const types: Array<('reserved' | 'disabled')> = ['reserved', 'disabled'];

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
     */
    private createMap(): void {
        const map = document.createElement('div');
        map.classList.add('sc-map');

        const disabled = this.options.map.disabled;
        let disabledRowsCounter = 0;

        const generateName = this.options.map.seatName || this.seatName.bind(this);

        // add rows containing seats
        for (let i = 0; i < this.options.map.rows; i += 1) {
            const row = new MapRowUI();

            const isRowDisabled = disabled?.rows ? disabled.rows.includes(i) : false;
            disabledRowsCounter = isRowDisabled ? disabledRowsCounter + 1 : disabledRowsCounter;

            let disabledColumnsCounter = 0;

            for (let j = 0; j < this.options.map.columns; j += 1) {
                const isColumnDisabled = disabled?.columns ? disabled.columns.includes(j) : false;
                disabledColumnsCounter = isColumnDisabled ? disabledColumnsCounter + 1 : disabledColumnsCounter;

                const seatTextContent = generateName(
                    { index: i, disabled: isRowDisabled, disabledCount: disabledRowsCounter },
                    { index: j, disabled: isColumnDisabled, disabledCount: disabledColumnsCounter },
                );
                const seatComponent = new SeatUI(
                    'available',
                    seatTextContent,
                    `${i}_${j}`,
                    this.seatClick.bind(this),
                    this.rightClickDelete.bind(this)
                );

                row.element.appendChild(seatComponent.element);
            }

            map.appendChild(row.element);
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

        const rowIndexContainer = new ContainerUI(null, rowContainerDirection);
        const columnIndexContainer = new ContainerUI(null, columnContainerDirection, itemsPosition);
        columnIndexContainer.element.append(rowIndexContainer.element);

        // create map container which will contain everything
        const mapContainer = new ContainerUI('map', 'column', itemsPosition);

        const frontHeader = new MapFrontHeaderUI();
        if (!front || front.visible === undefined || front.visible) {
            frontHeader.element.classList.add('sc-margin-bottom');
            mapContainer.element.appendChild(frontHeader.element);
        }

        if (!indexes || !indexes.columns || indexes.columns.visible === undefined || indexes.columns.visible) {
            const columnIndex = new MapIndexUI(
                'column',
                this.options.map.columns,
                this.options.map.disabled?.columns,
                this.columnName.bind(this) || this.options.map.indexes?.columns?.name
            );
            columnIndexContainer.element.appendChild(columnIndex.element);
        }

        if (!indexes || !indexes.rows || indexes.rows.visible === undefined || indexes.rows.visible) {
            const rowIndex = new MapIndexUI(
                'row',
                this.options.map.rows,
                this.options.map.disabled?.rows,
                this.columnName.bind(this) || this.options.map.indexes?.rows?.name
            );
            rowIndexContainer.element.appendChild(rowIndex.element);
        }

        rowIndexContainer.element.append(map);
        columnIndexContainer.element.append(rowIndexContainer.element);
        mapContainer.element.append(columnIndexContainer.element);

        const seatmap = document.getElementById(this.options.map.id);
        if (seatmap) {
            seatmap.appendChild(mapContainer.element);
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
            frontHeader.element.style.width = `${mapWidth}px`;
        }

        this.addDisabledSeatsToOptions();
        this.disableAndReserveSeats();
        this.selectSeats();
    }
}

export default MapUI;
