import { DEFAULT_TEXT_COLOR } from 'utils/consts';
import BaseUI from 'ui/base/Base';
import SmallTitleUI from 'ui/common/SmallTitle';
import DeleteButtonUI from 'ui/cart/DeleteButton';

/**
 * @internal
 */
class CartFooterUI extends BaseUI<HTMLDivElement> {
    private currency: string;
    private total: HTMLDivElement;

    /**
     * Creates the footer of the cart containing the total of the shopping cart and a delete-all button.
     * @param totalValue - Total cost of items.
     * @param currency - Price currency.
     * @param assetsPath - Path to assets.
     * @param deleteAllClick - Function called on delete-all button click.
     */
    public constructor(
        totalValue: number,
        currency: string | undefined,
        assetsPath: string | undefined,
        deleteAllClick: () => void
    ) {
        const currentCurrency = currency || DEFAULT_TEXT_COLOR;
        const container = document.createElement('div');
        const total = new SmallTitleUI(`Total: ${currentCurrency}${totalValue.toFixed(2)}`);
        total.element.className += ' sc-cart-total';

        const deleteBtn = new DeleteButtonUI(assetsPath, deleteAllClick);
        deleteBtn.element.classList.add('all');

        const label = document.createElement('p');
        label.textContent = 'All';
        deleteBtn.element.appendChild(label);

        container.appendChild(total.element);
        container.appendChild(deleteBtn.element);

        super(container);
        this.total = total.element;
        this.currency = currentCurrency;
    }

    /**
     * Updates the total price.
     * @param value - Total cost of items.
     */
    public updateTotal(value: number): void {
        this.total.textContent = `Total: ${this.currency}${value.toFixed(2)}`;
    }
}

export default CartFooterUI;
