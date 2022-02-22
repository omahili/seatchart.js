import InvalidParameterError from 'errors/invalid-parameter';
import NotFoundError from 'errors/not-found';
import { Options } from 'types/options';
import { SeatInfo } from 'types/seat-info';
import { SeatIndex, RowColumnInfo } from 'types/map-options';
import { DEFAULT_TEXT_COLOR } from 'utils/consts';
import Validator from 'utils/validator';
import { EventMap, ClearEvent, ChangeEvent } from 'types/events';
import CartUI from 'ui/cart/Cart';
import LegendUI from 'ui/legend/Legend';
import ContainerUI from 'ui/common/Container';
import SeatUI from 'ui/map/Seat';
import MapRowUI from 'ui/map/Row';
import MapFrontHeaderUI from 'ui/map/FrontHeader';
import MapIndexUI from 'ui/map/MapIndex';
import GapDetectionService from 'services/gap-detection';

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
    public onChangeEventListeners: Array<(e: ChangeEvent) => void> = [];

    /**
     * Array of listeners triggered when all seats are removed with the 'delete all' button in the shopping cart.
     */
    public onClearEventListeners: Array<(e: ClearEvent) => void> = [];

    private gapDetection: GapDetectionService;

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
        Validator.validateOptions(options);

        this.options = options;

        this.seatName = this.seatName.bind(this);
        this.seatClick = this.seatClick.bind(this);
        this.seatRightClick = this.seatRightClick.bind(this);
        this.columnName = this.columnName.bind(this);
        this.rowName = this.rowName.bind(this);

        this.types = ['available', ...this.options.types.map(x => x.type)];
        this.createMap();

        this.cart = new CartUI(this);
        this.legend = new LegendUI(options);

        this.gapDetection = new GapDetectionService(
            this.options.map.rows,
            this.options.map.columns,
            this.cart.getCart(),
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
    public addEventListener<T extends keyof EventMap>(type: T, listener: (e: EventMap[T]) => void): void {
        if (type === 'change') {
            this.onChangeEventListeners.push(listener as (e: ChangeEvent) => void);
        } else if (type === 'clear') {
            this.onClearEventListeners.push(listener as (e: ClearEvent) => void);
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
    public removeEventListener<T extends keyof EventMap>(type: T, listener: (e: EventMap[T]) => void): void {
        if (['change', 'clear'].includes(type)) {
            let eventListeners = type === 'change' ? this.onChangeEventListeners : this.onClearEventListeners;

            eventListeners.forEach((el, i: number) => {
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
    public isGap(seatIndex: SeatIndex): boolean {
        return this.gapDetection.isGap(seatIndex);
    }

    /**
     * Checks whether a seat creates a gap or not.
     * @param seatIndex - Seat index.
     * @returns True if it does, false otherwise.
     */
    public makesGap(seatIndex: SeatIndex): boolean {
        return this.gapDetection.makesGap(seatIndex);
    }

    /**
     * Gets all seats which represent a gap in the seat map.
     * @returns Array of indexes.
     */
    public getGaps(): SeatIndex[] {
        return this.gapDetection.getGaps();
    }

    /**
     * Gets seat info.
     * @param index - Seat index.
     * @returns Seat info.
     */
    public get(index: SeatIndex): SeatInfo {
        Validator.validateIndex(index, this.options.map.rows, this.options.map.columns);

        const { row, col } = index;
        const seatId = SeatUI.id(index.row, index.col);
        const name = this.getSeatName(seatId);

        let type = 'available';
        let price: number | null = null;

        // check if seat is reserved
        if (this.options.map.reserved?.seats && this.options.map.reserved.seats.some(x => x.row === row && x.col === col)) {
            type = 'reserved';
        }

        // check if seat is disabled
        if (this.options.map.disabled?.seats && this.options.map.disabled.seats.some(x => x.row === row && x.col === col)) {
            type = 'disabled';
        }

        const keys = Object.keys(this.cart.dict);
        // check if seat is already selected
        for (const k of keys) {
            const typePrice = this.cart.getSeatPrice(k);
            if (this.cart.dict[k].includes(seatId)) {
                type = k;
                price = typePrice;
            }
        }

        return {
            id: seatId,
            index,
            name,
            price,
            type,
        };
    }

    /**
     * Set seat type.
     * @param index - Index of the seat to update.
     * @param type - New seat type ('disabled', 'reserved' and 'available' are supported too).
     * @param emit - True to trigger onChangeListeners event (dafualt false).
     */
    public set(index: SeatIndex, type: string, emit: boolean): void {
        Validator.validateIndex(index, this.options.map.rows, this.options.map.columns);

        let seatType;
        if (typeof type !== 'string') {
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
                const arrayIndex = seats?.findIndex(x => index.col === x.col && index.row === x.row);
                if (seats && arrayIndex && arrayIndex >= 0) {
                    seats.splice(arrayIndex, 1);
                }
            }

            if (type === 'reserved' || type === 'disabled') {
                this.options.map[type]?.seats?.push(index);
            }

            if (seat.type !== 'available' && seat.type !== 'disabled' && seat.type !== 'reserved') {
                if (type !== 'available' && type !== 'disabled' && type !== 'reserved') {
                    if (this.cart.removeFromDict(seat.id, seat.type) && this.cart.addToDict(seat.id, type)) {
                        element.classList.add('clicked');
                        element.style.setProperty('background-color', seatType.backgroundColor);
                        element.style.setProperty('color', seatType.textColor || DEFAULT_TEXT_COLOR);
                        this.cart.updateCart('update', seat.id, type, seat.type, emit);
                    }
                } else if (this.cart.removeFromDict(seat.id, seat.type)) {
                    element.classList.remove('clicked');
                    element.style.removeProperty('background-color');
                    this.cart.updateCart('remove', seat.id, type, seat.type, emit);
                }
            } else if (type !== 'available' && type !== 'disabled' && type !== 'reserved') {
                if (this.cart.addToDict(seat.id, type)) {
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
    private seatClick(e: MouseEvent): void {
        const seat = e.target as HTMLElement;

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
                        if (this.cart.addToDict(seat.id, newClass)) {
                            this.cart.updateCart('add', seat.id, newClass, currentClass, true);
                        }
                    } else if (newClass === 'available') {
                        if (this.cart.removeFromDict(seat.id, currentClass)) {
                            this.cart.updateCart('remove', seat.id, newClass, currentClass, true);
                        }
                    } else if (this.cart.addToDict(seat.id, newClass) &&
                        this.cart.removeFromDict(seat.id, currentClass)) {
                        this.cart.updateCart('update', seat.id, newClass, currentClass, true);
                    }
                }
            }
        }

        this.cart.updateTotal();
    }

    /**
     * This function is fired when a seat is right clicked to be released.
     */
    private seatRightClick(e: Event): boolean {
        e.preventDefault();

        const seat = e.target as HTMLElement;

        try {
            const type = this.getSeatType(seat.id);

            // it means it has no type and it's available, then there's nothing to delete
            if (type !== undefined) {
                this.releaseSeat(seat.id);
                // remove from virtual sc
                this.cart.removeFromDict(seat.id, type);

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
    }

    /**
     * Generates a row name.
     * @param info - Row index (starts from 0).
     * @returns Row name. Returns null or undefined if empty.
     */
    private rowName(rowInfo: RowColumnInfo): string | undefined {
        if (!rowInfo.disabled) {
            return this.alphabet[rowInfo.index - rowInfo.disabledCount];
        }
    }

    /**
     * Generates a column name.
     * @param info - Column info object.
     * @returns Column name. Returns null or undefined if empty.
     */
    private columnName(columnInfo: RowColumnInfo): string | undefined {
        if (!columnInfo.disabled) {
            return ((columnInfo.index - columnInfo.disabledCount) + 1).toString();
        }
    }

    /**
     * Generates a seat name.
     * @param row - Row info object.
     * @param column - Column info object.
     * @returns Seat name. Returns null if empty.
     */
    private seatName(rowInfo: RowColumnInfo, columnInfo: RowColumnInfo): string | undefined {
        if (!rowInfo.disabled && !columnInfo.disabled) {
            const rowIndex = this.rowName(rowInfo);
            const columnIndex = this.columnName(columnInfo);

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
                for (let row = 0; row < this.options.map.rows; row += 1) {
                    this.options.map.disabled.seats.push({ row, col: disabledColumn });
                }
            }
        }

        // add disabled rows to disabled array
        const disabledRows = this.options.map.disabled?.rows;
        if (disabledRows) {
            for (const disabledRow of disabledRows) {
                for (let col = 0; col < this.options.map.columns; col += 1) {
                    this.options.map.disabled.seats.push({ row: disabledRow, col });
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
                for (const index of seats) {
                    const id = SeatUI.id(index.row, index.col);
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
                    const id = SeatUI.id(index.row, index.col);
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

        const generateName = this.options.map.seatName || this.seatName;

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
                    i,
                    j,
                    this.seatClick,
                    this.seatRightClick
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
                this.options.map.indexes?.columns?.name || this.columnName
            );
            columnIndexContainer.element.appendChild(columnIndex.element);
        }

        if (!indexes || !indexes.rows || indexes.rows.visible === undefined || indexes.rows.visible) {
            const rowIndex = new MapIndexUI(
                'row',
                this.options.map.rows,
                this.options.map.disabled?.rows,
                this.options.map.indexes?.rows?.name || this.rowName
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
