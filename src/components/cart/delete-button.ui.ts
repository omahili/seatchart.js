import BaseUI from 'components/base';

/**
 * @internal
 */
class DeleteButtonUI extends BaseUI<HTMLDivElement> {
    /**
     * Create a delete button for a shopping cart item.
     * @param path - Path to assets.
     * @param deleteClick - Function called on click.
     */
    public constructor(assetsPath: string | undefined, deleteClick: (e: MouseEvent) => any) {
        const binImg = document.createElement('img');
        binImg.src = assetsPath ?
            `${assetsPath}/bin.svg` :
            './assets/bin.svg';

        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'sc-cart-delete';
        deleteBtn.appendChild(binImg);
        deleteBtn.onclick = deleteClick;

        super(deleteBtn);
    }
}

export default DeleteButtonUI;
