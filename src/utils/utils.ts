/**
 * Capitalizes the first letter and lowers all the others.
 * @param {string} value - The formatted string.
 */
const capitalizeFirstLetter = (value: string): string =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

/**
 * Creates a container.
 * @param {string} name - Container name
 * @param {string} direction - Flex direction ('column', 'row', 'row-reverse' or 'column-reverse').
 * @param {string} [contentPosition] - Content position ('left', 'right', 'top' or 'bottom').
 * @returns {HTMLDivElement} The container.
 * @private
 */
const createContainer = (name: string | null, direction: string, contentPosition?: string): HTMLDivElement => {
    if (!['column', 'row', 'column-reverse', 'row-reverse'].includes(direction)) {
        throw new Error('\'direction\' must have one of the following values: ' +
            '\'column\', \'row\', \'column-reverse\', \'row-reverse\'');
    }

    if (contentPosition && !['left', 'right', 'top', 'bottom'].includes(contentPosition)) {
        throw new Error(
            '\'contentPosition\' must have one of the following values: ' +
            '\'left\', \'right\', \'top\', \'bottom\'',
        );
    }

    const container = document.createElement('div');

    if (name) {
        container.className = `sc-${name}-container`;
    }

    container.classList.add(`sc-container-${direction}`);

    if (contentPosition) {
        container.classList.add(`sc-${contentPosition}`);
    }

    return container;
};

/**
 * Creates a title with an icon.
 * @param {string} content - The title.
 * @param {string} src - The source path of the icon.
 * @param {string} alt - The text to be displed when the image isn't loaded properly.
 * @returns {HTMLDivElement} The iconed title.
 * @private
 */
const createIconedTitle = (content: string, src: string, alt: string): HTMLDivElement => {
    const container = document.createElement('div');
    const icon = document.createElement('img');
    icon.src = src;
    icon.alt = alt;

    const title = createTitle(content);
    container.className = title.className;
    title.className = '';

    container.appendChild(icon);
    container.appendChild(title);

    return container;
};

/**
 * Creates a title.
 * @param {string} content - The content of the title.
 * @returns {HTMLHeadingElement} The title.
 * @private
 */
const createTitle = (content: string): HTMLHeadingElement => {
    const title = document.createElement('h3');
    title.textContent = content;
    title.className = 'sc-title';

    return title;
};

export default {
    DOM: {
        createContainer,
        createIconedTitle,
        createTitle,
    },
    capitalizeFirstLetter,
};
