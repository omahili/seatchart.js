import BaseUI from 'components/base';

/**
 * @internal
 */
class Title extends BaseUI<HTMLHeadingElement> {
    /**
     * Creates a title.
     * @param content - The content of the title.
     * @returns The title.
     * @internal
     */
    public constructor(content: string) {
        const title = document.createElement('h3');
        title.textContent = content;
        title.className = 'sc-title';

        super(title);
    }
}

export default Title;
