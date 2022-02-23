import Base from 'components/base/Base';
import { DEFAULT_ASSETS_SRC } from 'utils/consts';

class DeleteButton extends Base<HTMLButtonElement> {
    public constructor(onclick: (e: MouseEvent) => void, assetsSrc?: string) {
        const binImg = document.createElement('img');
        binImg.src = `${assetsSrc || DEFAULT_ASSETS_SRC}/bin.svg`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'sc-cart-btn-delete';

        deleteBtn.appendChild(binImg);
        deleteBtn.onclick = onclick;

        super(deleteBtn);
    }
}

export default DeleteButton;
