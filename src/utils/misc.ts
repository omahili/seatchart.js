import { SeatIndex } from 'types/map-options';

/**
 * Capitalizes the first letter and lowers all the others.
 * @param value - The formatted string.
 * @internal
 */
const capitalizeFirstLetter = (value: string): string =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

/**
 * Empties an html element if it has any child.
 * @param el - Element.
 * @internal
 */
const emptyElement = (el: HTMLElement): void => {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
};

/**
 * Returns a function to check whether another index refers to the same seat.
 * @param index - Element.
 * @returns Function to check if any other index refers to same seat.
 * @internal
 */
export const isSameSeat = (index: SeatIndex) => (otherIndex: SeatIndex) => {
    return index.row === otherIndex.row && index.col === otherIndex.col;
};


export default {
    capitalizeFirstLetter,
    emptyElement,
};
