import BaseComponent from 'components/base';
import IconedTitle from 'components/common/iconed-tile';

/**
 * @internal
 */
class CartHeader extends BaseComponent<HTMLDivElement> {
    private counter: HTMLHeadingElement;

    /**
     * Creates a cart header containing the title and total count of items.
     * @param count - Total number of items.
     * @param assetsPath - Path to assets.
     */
    public constructor(count: number, assetsPath?: string) {
        const counter = document.createElement('h3');
        counter.textContent = `(${count})`;

        const assetPath = assetsPath ?
            `${assetsPath}/shoppingcart.svg` :
            '../assets/bin.svg';

        const cartTitle = new IconedTitle(
            'Your Cart',
            assetPath,
            'Shopping cart icon.',
        );

        cartTitle.element.appendChild(counter);

        super(cartTitle.element);
        this.counter = counter;
    }

    /**
     * Updates the total counter.
     * @param value - Total number of items.
     */
    public updateCounter(value: number): void {
        this.counter.textContent = `(${value})`;
    }
}

export default CartHeader;
