import BaseUI from 'ui/base/Base';
import TitleUI from 'ui/common/Title';

/**
 * @internal
 */
class IconedTitleUI extends BaseUI<HTMLDivElement> {
    /**
     * Creates a title with an icon.
     * @param content - The title.
     * @param src - The source path of the icon.
     * @param alt - The text to be displed when the image isn't loaded properly.
     */
    public constructor(content: string, src: string, alt: string) {
        const container = document.createElement('div');
        const icon = document.createElement('img');
        icon.src = src;
        icon.alt = alt;

        const title = new TitleUI(content);
        container.className = title.element.className;
        title.element.className = '';

        container.appendChild(icon);
        container.appendChild(title.element);

        super(container);
    }
}

export default IconedTitleUI;
