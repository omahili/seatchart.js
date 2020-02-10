import BaseComponent from 'components/base';

/**
 * @internal
 */
class SmallTitle extends BaseComponent<HTMLHeadingElement> {
    /**
     * Creates a small title.
     * @param content - The content of the title.
     */
    public constructor(content: string) {
        const smallTitle = document.createElement('h5');
        smallTitle.textContent = content;
        smallTitle.className = 'sc-small-title';

        super(smallTitle);
    }
}

export default SmallTitle;
