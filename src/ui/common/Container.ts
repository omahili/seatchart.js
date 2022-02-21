import BaseUI from 'ui/base/Base';

/**
 * @internal
 */
class ContainerUI extends BaseUI<HTMLDivElement> {
    /**
     * Creates a container.
     * @param name - Container name
     * @param direction - Flex direction ('column', 'row', 'row-reverse' or 'column-reverse').
     * @param contentPosition - Content position ('left', 'right', 'top' or 'bottom').
     */
    public constructor(name: string | null, direction: string, contentPosition?: string) {
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

        super(container);
    }
}

export default ContainerUI;
