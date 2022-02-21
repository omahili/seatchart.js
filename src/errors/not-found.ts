/**
 * @internal
 */
class NotFoundError extends Error {
    public constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export default NotFoundError;
