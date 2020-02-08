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


export default {
    capitalizeFirstLetter,
    emptyElement,
};
