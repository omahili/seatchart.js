import { DEFAULT_TEXT_COLOR } from 'utils/consts';
import BaseComponent from 'utils/base-component';
import SmallTitle from 'components/common/small-title';
import DeleteButton from './delete-button';

/**
 * @internal
 */
class CartFooter extends BaseComponent<HTMLDivElement> {
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
        deleteAllClick: () => any
    ) {
        const currentCurrency = currency || DEFAULT_TEXT_COLOR;
        const container = document.createElement('div');
        const total = new SmallTitle(`Total: ${currentCurrency}${totalValue}`);
        total.element.className += ' sc-cart-total';

        const deleteBtn = new DeleteButton(assetsPath, deleteAllClick);
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

export default CartFooter;