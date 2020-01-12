/**
 * Capitalizes the first letter and lowers all the others.
 * @param value - The formatted string.
 * @internal
 */
const capitalizeFirstLetter = (value: string): string =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

/**
 * Creates a container.
 * @param name - Container name
 * @param direction - Flex direction ('column', 'row', 'row-reverse' or 'column-reverse').
 * @param contentPosition - Content position ('left', 'right', 'top' or 'bottom').
 * @returns The container.
 * @internal
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
 * @param content - The title.
 * @param src - The source path of the icon.
 * @param alt - The text to be displed when the image isn't loaded properly.
 * @returns The iconed title.
 * @internal
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
 * @param content - The content of the title.
 * @returns The title.
 * @internal
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
