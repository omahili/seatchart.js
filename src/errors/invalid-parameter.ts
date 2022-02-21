/**
 * @internal
 */
class InvalidParameterError extends Error {
    public constructor(m: string) {
        super(m);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InvalidParameterError.prototype);
    }
}

export default InvalidParameterError;
