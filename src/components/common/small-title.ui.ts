import BaseUI from 'components/base';

/**
 * @internal
 */
class SmallTitle extends BaseUI<HTMLHeadingElement> {
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
