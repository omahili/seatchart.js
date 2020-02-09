/**
 * @internal
 */
class BaseComponent<T extends Element> {
    public readonly element: T;

    protected constructor(element: T) {
        this.element = element;
    }
}

export default BaseComponent;
