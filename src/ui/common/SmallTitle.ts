import BaseUI from 'ui/base/Base';

/**
 * @internal
 */
class SmallTitleUI extends BaseUI<HTMLHeadingElement> {
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

export default SmallTitleUI;
